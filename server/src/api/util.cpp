#include "util.h"
#include "src/database/db.h"
#include <functional>
#include <queue>
#include <unordered_set>

namespace api::util {
double calcGPSDistance(double latitud1, double longitud1, double latitud2, double longitud2)
{
    double haversine;
    double temp;
    double distancia_puntos;

    latitud1 = latitud1 * GRADOS_RADIANES;
    longitud1 = longitud1 * GRADOS_RADIANES;
    latitud2 = latitud2 * GRADOS_RADIANES;
    longitud2 = longitud2 * GRADOS_RADIANES;

    haversine =
        (pow(sin((1.0 / 2) * (latitud2 - latitud1)), 2)) +
        ((cos(latitud1)) * (cos(latitud2)) * (pow(sin((1.0 / 2) * (longitud2 - longitud1)), 2)));
    temp = 2 * asin(std::min(1.0, sqrt(haversine)));
    distancia_puntos = RADIO_TERRESTRE * temp;

    return distancia_puntos / 1000;
}

double calcMaxDistance(database::Database& db, std::string& plz, double maxDistance)
{
    if (auto opt = db.get_plz_density(plz)) {
        if (opt.value() == "a") {
            return maxDistance;
        } else if (opt.value() == "b") {
            return maxDistance + 2;
        } else if (opt.value() == "c") {
            return maxDistance + 5;
        }
    }
    return 0;
}

std::set<std::pair<std::string, double>, comp> get_ranking(database::Database& db, std::string plz)
{
    std::set<std::pair<std::string, double>, comp> ranking {};

    std::queue<std::string> q {};
    std::unordered_set<std::string> discovered {};

    std::pair<double, double> w_coords {};

    q.push(plz);
    discovered.insert(plz);

    while (!q.empty()) {
        std::string current_plz = q.front();
        q.pop();

        std::pair<double, double> plz_coords;
        if (auto opt = db.get_lat_lon_plz(current_plz)) {
            plz_coords = opt.value();
        } else {
            continue;
        }

        std::vector<std::string> w_nearest {}; // TODO

        for (auto& w_id : w_nearest) {
            std::pair<double, double> w_coords;
            if (auto opt = db.get_lat_lon_provider(w_id)) {
                w_coords = opt.value();
            } else {
                continue;
            }

            double dist = calcGPSDistance(
                w_coords.first, w_coords.second, plz_coords.first, plz_coords.second);

            double w_maxDist;
            if (auto opt = db.get_max_distance(w_id)) {
                w_maxDist = opt.value() / 1000;
            } else {
                continue;
            }

            if (dist < calcMaxDistance(db, current_plz, w_maxDist)) {
                ranking.insert(std::make_pair(w_id, calculateScore(db, w_id, dist)));
            }
        }

        for (auto& neighbour : db.get_neighbours(current_plz)) {
            std::pair<double, double> n_coords;
            if (auto opt = db.get_lat_lon_plz(neighbour)) {
                n_coords = opt.value();
            } else {
                continue;
            }

            double dist = calcGPSDistance(
                plz_coords.first, plz_coords.second, n_coords.first, n_coords.second);

            if (!discovered.contains(neighbour) && dist < db.maxMaxDist + 20) {
                discovered.insert(neighbour);
                q.push(std::move(neighbour));
            }
        }
    }
    return ranking;
}

double calculateScore(database::Database& db, std::string& w_id, double dist)
{
    double pfp_score;
    if (auto opt = db.get_pfp_score(w_id)) {
        pfp_score = opt.value();
    } else {
        return 0.0;
    }

    double pfd_score;
    if (auto opt = db.get_pfd_score(w_id)) {
        pfd_score = opt.value();
    } else {
        return 0.0;
    }

    double profile_score = 0.4 * pfp_score + 0.6 * pfd_score;

    double dist_score = 1 - (dist / 80);
    double dist_weight = ((dist > 80) ? 0.01 : 0.15);
    double total_score = dist_weight * dist_score + (1 - dist_weight) * profile_score;

    return total_score;
}

}

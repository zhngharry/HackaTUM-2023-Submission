#include "util.h"
#include "src/database/db.h"
#include <functional>
#include <stack>
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

void reachable_plzs(
    std::function<void(std::string, std::string, double, database::Database&)> f,
    database::Database& db,
    std::string w_id)
{
    std::stack<std::string> s {};
    std::unordered_set<std::string> discovered {};

    std::unordered_map<std::string, double> um{};

    if (auto opt = db.get_nearest_plz(w_id)) {
        s.push(opt.value());
        discovered.insert(opt.value());
    } else {
        return;
    }

    std::pair<double, double> w_coords {};
    if (auto opt = db.get_lat_lon_provider(w_id)) {
        w_coords = opt.value();
    } else {
        return;
    }

    double w_maxDist;
    if (auto opt = db.get_max_distance(w_id)) {
        w_maxDist = opt.value() / 1000;
    } else {
        return;
    }

    while (!s.empty()) {
        std::string plz = s.top();
        s.pop();

        std::pair<double, double> plz_coords;
        if (auto opt = db.get_lat_lon_plz(plz)) {
            plz_coords = opt.value();
        } else {
            continue;
        }
        double dist =
            calcGPSDistance(w_coords.first, w_coords.second, plz_coords.first, plz_coords.second);
        if (dist < calcMaxDistance(db, plz, w_maxDist)) {

            f(plz, w_id, dist, db);
            um.insert(std::make_pair(plz, dist));

            for (auto& neighbour : db.get_neighbours(plz)) {
                if (!discovered.contains(neighbour)) {
                    discovered.insert(neighbour);
                    s.push(std::move(neighbour));
                }
            }
        }
    }
    return;
}

void update_plz_wid(std::string plz, std::string w_id, double dist, database::Database& db)
{
    //db.update_wid_reachable(w_id, plz, dist);

    double pfp_score;
    if (auto opt = db.get_pfp_score(w_id)) {
        pfp_score = opt.value();
    } else {
        return;
    }

    double pfd_score;
    if (auto opt = db.get_pfd_score(w_id)) {
        pfd_score = opt.value();
    } else {
        return;
    }

    double profile_score = 0.4 * pfp_score + 0.6 * pfd_score;

    double dist_score = 1 - (dist / 80);
    double dist_weight = ((dist > 80) ? 0.01 : 0.15);
    double total_score = dist_weight * dist_score + (1 - dist_weight) * profile_score;

    db.update_plz_rank(w_id, plz, total_score);
}

}

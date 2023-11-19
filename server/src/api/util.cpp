#include "util.h"
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

    return distancia_puntos;
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

std::vector<std::string> reachable_plzs(database::Database& db, std::string w_id)
{
    std::vector<std::string> result {};
    std::stack<std::string> s {};
    std::unordered_set<std::string> discovered {};

    if (auto opt = db.get_nearest_plz(w_id)) {
        s.push(opt.value());
        discovered.insert(opt.value());
    } else {
        return {};
    }

    std::pair<double, double> w_coords {};
    if (auto opt = db.get_lat_lon_provider(w_id)) {
        w_coords = opt.value();
    } else {
        return {};
    }

    double w_maxDist;
    if (auto opt = db.get_max_distance(w_id)) {
        w_maxDist = opt.value();
    } else {
        return {};
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

        if (calcGPSDistance(w_coords.first, w_coords.second, plz_coords.first, plz_coords.second) <
            calcMaxDistance(plz, w_maxDist)) {
            result.push_back(plz);

            for (auto& neighbour : db.get_neighbours(plz)) {
                if (!discovered.contains(neighbour)) {
                    discovered.insert(neighbour);
                    s.push(std::move(neighbour));
                }
            }
        }
    }

    return result;
}
}

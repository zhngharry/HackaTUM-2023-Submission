#pragma once

#include "src/database/db.h"
#include <cmath>
#include <set>
#include <string>

constexpr double RADIO_TERRESTRE { 6372797.56085 };
constexpr double PI { 3.14159265358979323846 };
constexpr double GRADOS_RADIANES { PI / 180 };

namespace api::util {
double calcGPSDistance(double latitud1, double longitud1, double latitud2, double longitud2);

double calcMaxDistance(database::Database& db, std::string& plz, double maxDistance);

struct comp {
    bool operator()(
        const std::pair<std::string, double>& p1, const std::pair<std::string, double>& p2) const
    {
        return p1.second > p2.second;
    }
};
std::set<std::pair<std::string, double>, comp> get_ranking(database::Database& db, std::string plz);

double calculateScore(database::Database& db, std::string& w_id, double dist);

}

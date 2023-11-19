#pragma once

#include "src/database/db.h"
#include <cmath>
#include <string>
#include <vector>

constexpr double RADIO_TERRESTRE { 6372797.56085 };
constexpr double PI { 3.14159265358979323846 };
constexpr double GRADOS_RADIANES { PI / 180 };

namespace api::util {
double calcGPSDistance(double latitud1, double longitud1, double latitud2, double longitud2);

double calcMaxDistance(database::Database& db, std::string& plz, double maxDistance);
void reachable_plzs(
    std::function<void(std::string, std::string, double, database::Database&)> f,
    database::Database& db,
    std::string w_id);

void update_plz_wid(std::string plz, std::string w_id, double dist, database::Database& db);

}

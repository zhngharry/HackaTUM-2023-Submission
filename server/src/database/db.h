#pragma once

#include <crow/json.h>
#include <string>
#include <sw/redis++/redis.h>
#include <vector>

namespace database {

class Database {
public:
    Database();

    std::vector<std::pair<std::string, double>> get_precomputed_ranking(std::string plz);
    std::vector<std::string> get_neighbours(std::string& plz);

    crow::json::wvalue service_provider_ret_val(std::string& id, double rankval);

    std::string get_plz_density(std::string& plz);
    std::pair<double, double> get_lat_lon_provider(std::string& wid);
    int set_max_distance(std::string& wid);

    std::string get_nearest_plz(std::string& wid);
    int set_pfp_score(char score);
    int set_pfd_score(char score);

private:
    sw::redis::Redis m_redis;
};

}

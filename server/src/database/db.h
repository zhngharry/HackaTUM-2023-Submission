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

private:
    sw::redis::Redis m_redis;
};

}

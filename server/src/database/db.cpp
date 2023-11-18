#include "db.h"
#include <string>
#include <sw/redis++/redis.h>

namespace database {

Database::Database()
    : m_redis { "tcp://127.0.0.1" }
{
}

std::vector<std::pair<std::string, double>> Database::get_precomputed_ranking(std::string plz)
{
    // TODO
    return {};
}

std::vector<std::string> Database::get_neighbours(std::string& plz)
{
    std::vector<std::string> neighbours {};
    m_redis.smembers(plz, std::inserter(neighbours, neighbours.begin()));
    return neighbours;
}

crow::json::wvalue Database::service_provider_ret_val(std::string& id, double rankval)
{
    // TODO
    return {};
}
}

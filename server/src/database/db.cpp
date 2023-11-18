#include "db.h"
#include <optional>
#include <string>
#include <sw/redis++/redis.h>
#include <utility>

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

std::optional<std::string> Database::get_plz_density(std::string& plz)
{
    return m_redis.get(plz.append("_group"));
}

std::optional<std::pair<double, double>> Database::get_lat_lon_provider(std::string& wid)
{
    std::string prefix = "provider_";
    std::vector<std::optional<std::string>> vals;
    m_redis.hmget(prefix.append(wid), { "lat", "lon" }, std::back_inserter(vals));
    if(!vals[0].has_value() || !vals[1].has_value()){
        return {};
    }
    return std::make_pair(std::stod(vals[0].value()), std::stod(vals[1].value()));
}

std::optional<double> Database::get_pfp_score(std::string& wid) {
}

std::optional<double> Database::get_pfd_score(std::string& wid) {}

std::optional<std::string> Database::get_nearest_plz(std::string& wid)
{
    // TODO
}

int Database::set_pfp_score(std::string& wid, char score)
{
    // TODO
}

int Database::set_pfd_score(std::string& wid, char score)
{
    // TODO
}

int Database::set_max_distance(std::string& wid, size_t max_distance)
{
    // TODO
}

}

#include "db.h"
#include "src/api/util.h"
#include <cwchar>
#include <optional>
#include <sstream>
#include <string>
#include <sw/redis++/redis.h>
#include <utility>

namespace database {

Database::Database()
    : m_redis { "tcp://127.0.0.1" }
{
}

std::vector<std::pair<std::string, double>> Database::get_precomputed_ranking(
    std::string plz, std::size_t start, std::size_t end)
{
    std::vector<std::pair<std::string, double>> result {};
    m_redis.zrange("rank_" + plz, start, end, std::back_inserter(result));
    return result;
}

std::vector<std::string> Database::get_neighbours(std::string& plz)
{
    std::vector<std::string> neighbours {};
    m_redis.smembers(plz, std::inserter(neighbours, neighbours.begin()));
    return neighbours;
}

crow::json::wvalue Database::service_provider_ret_val(
    std::string id, double rankval, std::string plz)
{
    std::pair<double, double> plz_coords;
    if (auto opt = get_lat_lon_plz(plz)) {
        plz_coords = opt.value();
    } else {
        return {};
    }
    std::pair<double, double> w_coords;
    if (auto opt = get_lat_lon_provider(id)) {
        w_coords = opt.value();
    } else {
        return {};
    }

    double distance = api::util::calcGPSDistance(
        plz_coords.first, plz_coords.second, w_coords.first, w_coords.second);

    std::unordered_map<std::string, std::string> map {};
    m_redis.hgetall("provider_" + id, std::inserter(map, map.begin()));
    // TODO: add score
    double pfp_score;
    if (auto opt = get_pfp_score(id)) {
        pfp_score = opt.value();
    } else {
        return {};
    }

    double pfd_score;
    if (auto opt = get_pfd_score(id)) {
        pfd_score = opt.value();
    } else {
        return {};
    }

    return { { "id", std::stoi(id) },
             { "name", map.find("name")->second },
             { "rankingScore", rankval },
             { "profile_score", 0.4 * pfp_score + 0.6 * pfd_score },
             { "distance", distance },
             { "city", map.find("city")->second },
             { "street", map.find("street")->second },
             { "house_number", map.find("house_number")->second } };
}

std::optional<std::string> Database::get_plz_density(std::string& plz)
{
    return m_redis.get(plz + "_group");
}

std::optional<std::pair<double, double>> Database::get_lat_lon_provider(std::string& wid)
{
    std::vector<std::optional<std::string>> vals;
    m_redis.hmget(provider_prefix + wid, { "lat", "lon" }, std::back_inserter(vals));
    if (!vals[0].has_value() || !vals[1].has_value()) {
        return {};
    }
    return std::make_pair(
        std::strtod(vals[0].value().c_str(), nullptr),
        std::strtod(vals[1].value().c_str(), nullptr));
}

std::optional<std::pair<double, double>> Database::get_lat_lon_plz(std::string& plz)
{
    std::vector<std::optional<std::string>> vals;
    m_redis.hmget(plz + "_coord", { "lat", "lon" }, std::back_inserter(vals));
    if (!vals[0].has_value() || !vals[1].has_value()) {
        return {};
    }
    return std::make_pair(
        std::strtod(vals[0].value().c_str(), nullptr),
        std::strtod(vals[1].value().c_str(), nullptr));
}

std::optional<double> Database::get_pfp_score(std::string& wid)
{
    auto result = m_redis.hget(provider_prefix + wid, "profile_picture_score");
    if (!result.has_value()) {
        return {};
    }
    return std::strtod(result.value().c_str(), nullptr);
}

std::optional<double> Database::get_pfd_score(std::string& wid)
{
    auto result = m_redis.hget(provider_prefix + wid, "profile_description_score");
    if (!result.has_value()) {
        return {};
    }
    return std::strtod(result.value().c_str(), nullptr);
}

std::optional<double> Database::get_max_distance(std::string& wid)
{
    auto result = m_redis.hget(provider_prefix + wid, "max_driving_distance");
    if (!result.has_value()) {
        return {};
    }
    return std::strtod(result.value().c_str(), nullptr);
}

std::optional<std::string> Database::get_nearest_plz(std::string& wid)
{
    return m_redis.hget(provider_prefix + wid, "nearest_plz");
}

void Database::set_pfp_score(std::string& wid, double score)
{
    std::ostringstream strs;
    strs << score;
    m_redis.hset(provider_prefix + wid, "profile_picture_score", strs.str());
}

void Database::set_pfd_score(std::string& wid, double score)
{
    std::ostringstream strs;
    strs << score;
    m_redis.hset(provider_prefix + wid, "profile_description_score", strs.str());
}

void Database::set_max_distance(std::string& wid, size_t max_distance)
{
    std::ostringstream strs;
    strs << max_distance;
    m_redis.hset(provider_prefix + wid, "max_driving_distance", strs.str());
}

void Database::update_wid_reachable(std::string& wid, std::string& plz, double dist)
{
    std::string prefix = "reachable_";
    m_redis.zadd(prefix + wid, plz, dist);
}

void Database::update_wid_reachable_mass(
    std::string& wid, std::unordered_map<std::string, double> um)
{
    std::string prefix = "reachable_";
    m_redis.zadd(prefix + wid, um.begin(), um.end());
}

void Database::remove_wid_reachable(std::string& wid, std::string& plz)
{
    return;
}

void Database::update_plz_rank(std::string& wid, std::string& plz, double score)
{
    std::string prefix = "rank_";
    m_redis.zadd(prefix + plz, wid, score);
}

void Database::update_plz_rank_mass(
    const std::string& plz, std::unordered_map<std::string, double> um)
{
    std::string prefix = "rank_";
    m_redis.zadd(prefix + plz, um.begin(), um.end());
}

}

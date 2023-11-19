#pragma once

#include <crow/json.h>
#include <optional>
#include <string>
#include <sw/redis++/redis.h>
#include <vector>

namespace database {

class Database {
public:
    Database();

    std::vector<std::pair<std::string, double>> get_precomputed_ranking(
        std::string plz, std::size_t start, std::size_t end);
    std::vector<std::string> get_neighbours(std::string& plz);

    crow::json::wvalue service_provider_ret_val(std::string& id, double rankval, std::string plz);

    std::optional<std::string> get_plz_density(std::string& plz);
    std::optional<std::pair<double, double>> get_lat_lon_provider(std::string& wid);
    std::optional<std::pair<double, double>> get_lat_lon_plz(std::string& plz);
    std::optional<std::string> get_nearest_plz(std::string& wid);
    std::optional<double> get_pfp_score(std::string& wid);
    std::optional<double> get_pfd_score(std::string& wid);
    std::optional<double> get_max_distance(std::string& wid);

    /* Set maximum distance of given worder id
     * @param:
     *  - wid (string)
     *  - max_distance (size_t)
     * */
    void set_max_distance(std::string& wid, size_t max_distance);

    /* Set profile picture score of given worder id
     * @param:
     *  - wid (string)
     *  - score (char)
     * */
    void set_pfp_score(std::string& wid, double score);

    /* Set profile description score of given worder id
     * @param:
     *  - wid (string)
     *  - score (char)
     * */
    void set_pfd_score(std::string& wid, double score);

    void update_wid_reachable(std::string& wid, std::string& plz, double dist);

    void update_wid_reachable_mass(std::string& wid, std::unordered_map<std::string, double> um);

    void remove_wid_reachable(std::string& wid, std::string& plz);

    void update_plz_rank_mass(const std::string& plz, std::unordered_map<std::string, double> um);

    void update_plz_rank(std::string& wid, std::string& plz, double score);

    void remove_plz_rank(std::string& wid, std::string& plz);

private:
    sw::redis::Redis m_redis;
    std::string provider_prefix { "provider_" };
};

}

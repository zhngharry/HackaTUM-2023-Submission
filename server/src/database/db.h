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

    std::vector<std::pair<std::string, double>> get_precomputed_ranking(std::string plz);
    std::vector<std::string> get_neighbours(std::string& plz);

    crow::json::wvalue service_provider_ret_val(std::string& id, double rankval);

    std::optional<std::string> get_plz_density(std::string& plz);
    std::optional<std::pair<double, double>> get_lat_lon_provider(std::string& wid);
    std::optional<std::pair<double, double>> get_lat_lon_plz(std::string& plz);
    std::optional<std::string> get_nearest_plz(std::string& wid);
    std::optional<double> get_pfp_score(std::string& wid);
    std::optional<double> get_pfd_score(std::string& wid);
    std::optional<double> get_max_distance(std::string& wid);

    void add_nerest_wi(const std::string& plz, std::vector<std::string> v);

    std::vector<std::string> get_nearest_wi(std::string& plz);

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

private:
    sw::redis::Redis m_redis;
    static constexpr std::string provider_prefix{"provider_"};
};

}

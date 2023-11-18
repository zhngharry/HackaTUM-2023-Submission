#include "db.h"
#include <iostream>
#include <string>
#include <sw/redis++/redis.h>

namespace database {


std::vector<size_t> Database::get_ranking(std::string& plz, std::size_t amount)
{
    auto redis = sw::redis::Redis("tcp://127.0.0.1");
    std::unordered_set<std::string> set{};
    redis.smembers(plz, std::inserter(set, set.begin()));
    std::vector<size_t> result{};
    for (auto it=set.begin(); it != set.end(); ++it){
        result.push_back(std::stoi(*it));
    }
       return result;
}
}


#include "db.h"
#include <iostream>
#include <string>
#include <sw/redis++/redis.h>

namespace database {

Database::Database()
    : m_c { redisConnect("localhost", 6379) }
{
    if (m_c != nullptr && m_c->err) {
        std::cerr << "Error: " << m_c->errstr << '\n';
    } else {
        std::cerr << "Successfully connected to database\n";
    }
}

Database::~Database()
{
    redisFree(m_c);
}

std::vector<ServiceProvider> Database::get_ranking(std::string& plz, std::size_t amount)
{
    auto redis = sw::redis::Redis("tcp://127.0.0.1");
    redis.set("key", "value");
       return {};
}
}


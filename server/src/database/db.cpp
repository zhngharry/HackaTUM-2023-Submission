#include "db.h"
#include <iostream>

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
    redisReply* reply = static_cast<redisReply*>(redisCommand(m_c, "SMEMBERS %s", plz.c_str()));
    std::cout << reply->str << '\n';
    freeReplyObject(reply);

    return {};
}
}

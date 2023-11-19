
#include "src/database/db.h"
#include <optional>
#include <string>

int main(void)
{
    database::Database d{};
    std::string w = "12972";
    std::string p = "78661";
    d.update_wid_reachable(w, p, 30);
}

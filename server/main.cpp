
#include "src/api/util.h"
#include "src/database/db.h"
#include <optional>
#include <string>

int main(void)
{
    database::Database d {};

    for (size_t i = 1; i < 67277; i++) {
        std::cout << i << std::endl;
        api::util::reachable_plzs(api::util::update_plz_wid, d, std::to_string(i));
    }
}

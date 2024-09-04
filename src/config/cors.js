import "dotenv/config";
import { WHITELIST_DOMAIN } from "@/uilt/constants";
import ApiError from "@/uilt/ApiError";
import { StatusCodes } from "http-status-codes";

export const corsOptions = {
  origin: function (origin, callback) {
    // cho phép postmain có thể truy cập đến api vì origin của postmain thường không được đính kèm với request nên nó sẽ là undefined (khi đang ở môi trường dev)
    if (!origin && process.env.BUILD_MODE === "dev") {
      return callback(null, true);
    }

    // kiểm tra đến các đường dẫn được cho phép gọi đến api Trello web này
    if (WHITELIST_DOMAIN.includes(origin)) {
      return callback(null, true);
    }

    // nếu origin không phải là trang web nào trong whitelist_DOMAIN thì trả về false và thông báo l��i
    return callback(new ApiError(StatusCodes.FORBIDDEN, "Not allowed by CORS"));
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

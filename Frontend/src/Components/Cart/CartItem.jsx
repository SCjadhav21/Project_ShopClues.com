import {
  Box,
  Flex,
  HStack,
  Link,
  StackDivider,
  Text,
  useBreakpointValue,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import { formatPrice } from "./PriceTag";
import { CartProductMeta } from "./CartProductMeta";
import { QuantitySelect } from "./QuantitySelect";
import axios from "axios";
import {
  getcartError,
  getcartRequest,
  getcartSuccess,
} from "../../REDUX/action";
import { useDispatch, useSelector } from "react-redux";

const onClickDelete = (_id) => {
  return axios.delete(`https://splendid-bear-cap.cyclic.app/cart/${_id}`, {
    headers: {
      "content-type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
};
const getData = () => {
  return axios.get("https://splendid-bear-cap.cyclic.app/cart", {
    headers: {
      "content-type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
};
export const CartItem = (props) => {
  const {
    isBestSeller,
    image,
    isInStock,
    _id,
    onClickSaveForLater,
    price,
    locale,
    currency,
    quantity,
    product_name,
    shipping,
  } = props;
  const dispatch = useDispatch();
  const handleGet = () => {
    dispatch(getcartRequest());
    getData()
      .then((el) => {
        dispatch(getcartSuccess(el.data));
      })
      .catch((err) => {
        dispatch(getcartError());
        console.log(err);
      });
  };

  const handleDelete = (_id) => {
    onClickDelete(_id).then((res) => {
      handleGet();
    });
  };

  React.useEffect(() => {
    handleGet();
  }, []);

  const isMobile = useBreakpointValue({ base: true, md: false });
  return isMobile ? (
    <Box>
      <Flex>
        <CartProductMeta
          isInStock={isInStock}
          title={product_name}
          shipping={shipping}
          image={image}
          isBestSeller={isBestSeller}
        />
        <Text pt="1" fontSize="sm" fontWeight="semibold">
          {formatPrice(price, { locale, currency })}
        </Text>
      </Flex>
      <HStack mt="2" justify="space-between">
        <HStack
          mt="2"
          fontSize="sm"
          fontWeight="medium"
          divider={<StackDivider />}
          spacing="3"
          color={mode("blue.600", "blue.300")}
        >
          <Link
            as="button"
            type="button"
            onClick={() => {
              handleDelete(_id);
            }}
          >
            Delete
          </Link>
          <Link as="button" type="button" onClick={onClickSaveForLater}>
            Save for later
          </Link>
        </HStack>
        <QuantitySelect id={_id} />
      </HStack>
    </Box>
  ) : (
    <Flex align="flex-start" justify="space-between">
      <CartProductMeta
        isInStock={isInStock}
        title={product_name}
        shipping={shipping}
        image={image}
        isBestSeller={shipping}
      />
      <HStack width="full" maxW="sm" justify="space-between">
        <QuantitySelect id={_id} />
        <Flex
          direction="column"
          align="flex-end"
          justify="space-between"
          width="full"
          maxW="2xs"
          minH="16"
        >
          <Text fontWeight="semibold">
            {formatPrice(price, { locale, currency })}{" "}
          </Text>
          <Flex direction="column" align="center">
            <HStack
              mt="2"
              fontSize="sm"
              fontWeight="medium"
              divider={<StackDivider />}
              spacing="3"
              color={mode("blue.600", "blue.300")}
            >
              <Link
                as="button"
                type="button"
                fontWeight="medium"
                onClick={() => {
                  handleDelete(_id);
                }}
              >
                Delete
              </Link>
              <Link
                as="button"
                type="button"
                fontWeight="medium"
                onClick={onClickSaveForLater}
              >
                Save for later
              </Link>
            </HStack>
          </Flex>
        </Flex>
      </HStack>
    </Flex>
  );
};

import { FaUserCircle, FaRegHeart } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { FiShoppingCart } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { MdOutlineSwitchAccount } from "react-icons/md";
import React, { useState, useEffect } from "react";
import "./Homepage.css";
import {
  Box,
  Button,
  Flex,
  Input,
  Image,
  Text,
  Center,
  Tag,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Menu,
  useDisclosure,
  useToast,
  Hide
} from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
} from '@chakra-ui/react'
import Empty from "../Resources/empty.gif"
import ShopQ from "../Resources/ShopQ.jpeg";
import { Link, Navigate } from "react-router-dom";
import {
  BellIcon,
} from "@chakra-ui/icons";
import { MdLocationOn } from "react-icons/md";
import { HiShoppingCart } from "react-icons/hi";
import Navlist from "./Trial/Navlist";
import axios from "axios";
import { useSelector } from "react-redux";


const Navbar = () => {
  const toast = useToast()
  const store = useSelector((store) => store.Cart.cart);
  const [cart, setCart]=useState([])
  const getData = () => {
    axios.get("https://splendid-bear-cap.cyclic.app/cart", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    }).then((el)=>{
      setCart(el.data)
    });
  };
// console.log(cart)
  
  
 
  const [data, setData] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [add, setAdd] = useState(false);
  const [address, setAdress] = useState("");
  const [data2, setData2] = useState(false);
  const [goadmin, setGoadmin] = useState(false);
  const checkAuth = () => {
    axios(`https://splendid-bear-cap.cyclic.app/users/`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (res.data.msg == "Not Authorised") {
          setData2(true);
        }
      })

      .catch((err) => console.error(err));
  };

  const AuthorisedOrNot = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      alert("Please Login First");
    } else if (data2) {
      alert("You are Not Authorized");
    } else {
      setGoadmin(true);
    }
  };

  const getuserdata = () => {
    axios(`https://splendid-bear-cap.cyclic.app/users/personalDetail`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        setData(res.data.data.name);
        setAdress(res.data.data.address.city);
      })
      .catch((err) => console.error(err));
  };

  const handleLogou = () => {};
  const handleLogin = () => {
    let token = localStorage.getItem("token");

    token ? getuserdata() : setData("Sign In");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setData("Sign In");
  };
  useEffect(() => {
    getData()
   
  }, [store]);
  
  

  useEffect(() => {
    checkAuth();
    handleLogin();
  }, [add]);
  if (goadmin) {
    return <Navigate to="/adminpage" />;
  }
  
  console.log(cart)
  return (
    <Box backgroundColor={"#ffffff"}>
      <Box
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
          mt: "1%",
        }}
      >
        <Box  w={{ base: 210, md: 150, lg: 200 }} mt={"10px"} >
          <Link to="/">
          <Image src={ShopQ} />
          </Link>
        </Box>
      <Hide below="md">
        <Center
          borderRadius={"10px"}
          w={{ base: "30%", sm: "40%", md: "45%" }}
        >
          <Input
            w={"85%"}
            borderRadius={"0"}
            bgColor={"#e9f6f7"}
            border={"1px solid grey"}
            placeholder="What is on your mind today?"
          />
          <Button
            w={"15%"}
            style={{
              border: "none",
              background:
                "linear-gradient(90deg, rgba(255,142,77,1) 6%, rgba(255,100,95,1) 61%)",
              borderRadius: "0px 9px 9px 0px",
              color: "white",
            }}
          >
            Search
          </Button>
        </Center>
        </Hide>

        <Box w={["50%", "40%", "22%"]} marginTop={{base:"25px",sm:"25px",md:"15px",lg:"10px"}} >
          <Center style={{ justifyContent: "space-around" }}>
            <Link href="" textDecoration={"none"} color={"teal"}>
              <Hide below="md">
              <Center>
                <MdLocationOn fontSize={25} color={"#24a3b5"} w={"20px"} />
              </Center>
              
              <Text fontWeight={"500"} color={"#ff645f"}>
                {" "}
                {data !== "Sign In" ? address.toUpperCase() : ""}
              </Text>
              </Hide>
            </Link>
            <Hide below="md">
            <Link>
              <Center>
                <BellIcon color={"#24a3b5"} fontSize={25} />
              </Center>
            </Link>
            </Hide>
              <Center>
                {data==="Sign In" ?  
  <HiShoppingCart color={"#24a3b5"} fontSize={25} onMouseEnter={onOpen} onClick={()=>{toast({
    title: "Please Log In",
    description: "You're not Authorised to use this Functionality.",
    status: "error",
    duration: 3000,
    isClosable: true,
  });}}/>
    :   <Popover isOpen={isOpen}>  
  <PopoverTrigger>
  <Link to="/cart" >
  {cart.length>0? <Center ml={"5px"} fontWeight={"bold"} borderRadius={"50%"} color={"white"} h={"20px"} w={"20px"} bg={"#ff645f"}>{cart.length}</Center>:""}
     
  <HiShoppingCart color={"#24a3b5"} fontSize={25} onMouseEnter={onOpen} />
  
    </Link>
  </PopoverTrigger>
  <PopoverContent onMouseLeave={onClose}>
    <PopoverArrow />
    <PopoverHeader fontWeight={"bold"}>Your Shopping Cart ({cart.length} Item)</PopoverHeader>
    <PopoverBody maxH="300px" overflow={"scroll"}>{cart.length>0 ? cart?.map((el,index)=>{
      return <Box borderBottom={"2px solid #24a3b5"} p={"7px"} key={index}>
        <Flex >
          <Center gap={5}>
        <Image h={"50px"} w={"60px"} src={el.image}></Image>
        <Text>{el.product_name}</Text>
        </Center>
        </Flex>
       <Text fontWeight={"bold"}>Rs {el.price}</Text>
      </Box>
    }):<Image mt={'39px'} src={Empty}></Image>}</PopoverBody>
  </PopoverContent>
</Popover>}
            
              </Center>

              {/* <Button border={"none"} backgroundColor={"transparent"}>
                <Image
                  w={"22px"}
                  h={"20px"}
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmWILI-X5CIcJt1_73TP-c7j2bVHrMq94GDTh0DyAvYpGhkeNcD2WKPuGJdiZHc0iVmUE&usqp=CAU"
                  // src="https://www.shutterstock.com/shutterstock/photos/1569447439/display_1500/stock-vector-empty-color-shopping-cart-flat-modern-design-colored-vector-icon-isolated-on-white-background-web-1569447439.jpg"
                />
              </Button> */}
        
            <Link to={data == "Sign In" ? "/login" : ""}>
              <Center>
                <Menu>
                  <MenuButton
                    // handleLogout
                    onClick={data == "Sign In" ? handleLogin : handleLogou()}
                    border={"none"}
                    backgroundColor={"transparent"}
                    fontWeight={"500"}
                    as={IconButton}
                    aria-label="Options"
                    icon={
                      <Tag bg={"#ff645f"} color={"white"} h={10}>
                        {data !== "SIGN IN" ? data.toUpperCase() : "Sign In"}
                      </Tag>
                    }
                    variant="outline"
                  />
                  <MenuList
                    p="0px"
                    boxShadow="rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px"
                  >
                    <Box
                      borderRadius="5px 5px 0% 0%"
                      bgColor="#24A3B5"
                      h="65px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={5}
                    >
                      <FaUserCircle fontSize="35px" color="#fff" />
                      {/* <Img
                        w="40px"
                        h="40px"
                        borderRadius="50%"
                        src="https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png"
                        alt="error in url"
                      /> */}
                      <Text color="#fff" fontWeight="bold">
                        {data.toUpperCase()}
                      </Text>
                    </Box>

                    
                      <MenuItem
                        p="8px 15px"
                        fontSize="18px"
                        onClick={AuthorisedOrNot}
                        icon={<RiAdminLine />}
                      >
                        Admin Page
                      </MenuItem>
                    
                    
                    <MenuItem
                      p="8px 15px"
                      fontSize="18px"
                      icon={<FaRegHeart />}
                    >
                      WishList
                    </MenuItem>
                    <MenuItem
                      p="8px 15px"
                      fontSize="18px"
                      icon={<MdOutlineSwitchAccount />}
                    >
                      My Profie
                    </MenuItem>
                    <MenuItem
                      p="8px 15px"
                      fontSize="18px"
                      icon={<FiShoppingCart />}
                    >
                      <Link href="/cart">My Cart</Link>
                    </MenuItem>
                    <MenuItem
                      p="8px 15px 15px 15px"
                      onClick={() => handleLogout()}
                      fontSize="18px"
                      icon={<BiLogOut />}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Center>
            </Link>
          </Center>
        </Box>
      </Box>
      <Hide below="md">
      <Navlist />
      </Hide>
      <Hide below="md">
      <Box className="navbarpanel">
        <Box id="navbar">
          <Link href="" className="navbutton">
            Time sales
          </Link>
          <Link href="" className="navbutton">
            Flue Care
          </Link>
          <Link href="" className="navbutton">
            Food & Beverage
          </Link>
          <Link href="" className="navbutton">
            Personal Hygiene
          </Link>
          <Link href="" className="navbutton">
            Home Cleaning
          </Link>
          <Link href="" className="navbutton">
            Nutrition & Suplements
          </Link>
          <Link href="" className="navbutton">
            Kitchen & Dining
          </Link>
          <Link href="" className="navbutton">
            {" "}
            Refurbished Mobiles
          </Link>
          <Link href="" className="navbutton">
            {" "}
            Mobile Accessories
          </Link>
        </Box>
      </Box>
      </Hide>
      {/* <Product/> */}
      {/* <Box w={"50%"} maxW="3xl" mx="auto" px={{ base: "4", md: "8", lg: "12" }} py={{ base: "6", md: "8", lg: "12" }}>
          <Gallery images={images}/>
        </Box> */}

      {/* <UncontrolledExample/> */}
      {/* <Ads/>
       <Product/> */}
    </Box>
  );
};

export default Navbar;

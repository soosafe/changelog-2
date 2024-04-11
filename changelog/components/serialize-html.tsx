import React, { Fragment } from "react";
import escapeHTML from "escape-html";
import { Text } from "slate";
import {
  Heading,
  ListItem,
  OrderedList,
  Text as ChakraText,
  UnorderedList,
  useColorModeValue,
} from "@chakra-ui/react";

const serialize = (children) =>
  children.map((node: any, i) => {
    if (Text.isText(node)) {
      let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />;

      //@ts-ignore
      if (node.bold) {
        text = <strong key={i}>{text}</strong>;
      }

      //@ts-ignore
      if (node.code) {
        text = <code key={i}>{text}</code>;
      }

      //@ts-ignore
      if (node.italic) {
        text = <em key={i}>{text}</em>;
      }

      // Handle other leaf types here...

      return <Fragment key={i}>{text}</Fragment>;
    }

    if (!node) {
      return null;
    }

    switch (node.type) {
      case "h1":
        return (
          <Heading
            as="h1"
            fontSize={["2xl", "2xl", "32px"]}
            color={useColorModeValue("#000", "#fff")}
            key={i}
          >
            {serialize(node.children)}
          </Heading>
        );
      case "h2":
        return (
          <ChakraText
            fontWeight="bold"
            fontSize="xl"
            mt={12}
            mb={6}
            color={useColorModeValue("#000", "#fff")}
            key={i}
          >
            {serialize(node.children)}
          </ChakraText>
        );
      case "blockquote":
        return <blockquote key={i}>{serialize(node.children)}</blockquote>;
      case "ul":
        return (
          <UnorderedList spacing={4} key={i}>
            {serialize(node.children)}
          </UnorderedList>
        );
      case "ol":
        return (
          <OrderedList spacing={4} key={i}>
            {serialize(node.children)}
          </OrderedList>
        );
      case "li":
        return (
          <ListItem
            color={useColorModeValue("#495057", "#fff")}
            lineHeight="32px"
            fontSize="16px"
            _before={{ content: "unset" }}
            key={i}
          >
            {serialize(node.children)}
          </ListItem>
        );
      case "link":
        return (
          <ChakraText
            as="a"
            rel="noopener noreferrer"
            color="#6868F7"
            fontWeight="bold"
            href={escapeHTML(node.url)}
            key={i}
          >
            {serialize(node.children)}
          </ChakraText>
        );

      default:
        return (
          <ChakraText
            my={6}
            color={useColorModeValue("#495057", "#fff")}
            fontSize="16px"
            lineHeight="24px"
            key={i}
          >
            {serialize(node.children)}
          </ChakraText>
        );
    }
  });

export default serialize;

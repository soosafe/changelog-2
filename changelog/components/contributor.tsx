import { Avatar, Flex, HStack, Text } from "@chakra-ui/react";

interface ContributorProps {
  avatar: {
    url: string;
  };
  name: string;
}

export function Contributor(props: ContributorProps) {
  return (
    <HStack spacing={4}>
      {!!props.avatar.url && <Avatar src={props.avatar.url} />}
      <Flex direction="column" align="flex-start" justify="center">
        <Text fontWeight="semibold">{props.name}</Text>
      </Flex>
    </HStack>
  );
}

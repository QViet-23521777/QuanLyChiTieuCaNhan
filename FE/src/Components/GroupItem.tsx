// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// const GroupItem = () => {
//     return (
//         <View style={styles.container}>
//             <View style={styles.circle} />
//             <Text style={styles.name}>Group A</Text>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "transparent", // màu nền giống ảnh
//         padding: 10,
//     },
//     circle: {
//         width: 50,
//         height: 50,
//         borderRadius: 25, // tạo hình tròn
//         backgroundColor: "#66B2FF", // màu xanh dương
//         marginRight: 10,
//     },
//     name: {
//         fontSize: 16,
//         color: "#111827", // màu chữ giống ảnh
//         fontWeight: "500",
//     },
// });

// export default GroupItem;


import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserItem from "./UserItem";

interface User {
  name: string;
}

interface Props {
  groupId: string;
  groupName: string;
  users: User[];
  onDeleteGroup: (groupId: string) => void;
  onDeleteUser: (groupId: string, userIndex: number) => void;
}

const GroupItem: React.FC<Props> = ({
  groupId,
  groupName,
  users,
  onDeleteGroup,
  onDeleteUser,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.groupHeader}>
        <View style={styles.circle} />
        <Text style={styles.name}>{groupName}</Text>
        <TouchableOpacity onPress={() => onDeleteGroup(groupId)}>
          <Ionicons name="trash" size={22} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>

      {expanded &&
        users.map((user, index) => (
          <UserItem
            key={index}
            name={user.name}
            onDelete={() => onDeleteUser(groupId, index)}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFFF5",
    padding: 12,
    borderRadius: 20,
    marginHorizontal: 16,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#66B2FF",
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
});

export default GroupItem;


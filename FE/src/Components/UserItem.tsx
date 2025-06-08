// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// const UserItem = () => {
//     return (
//         <View style={styles.container}>
//             <View style={styles.circle} />
//             <Text style={styles.name}>Nguyen Van A</Text>
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

// export default UserItem;


import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  name: string;
  onDelete: () => void;
}

const UserItem: React.FC<Props> = ({ name, onDelete }) => {
  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <Text style={styles.name}>{name}</Text>
      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash" size={18} color="#111827" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFFF5",
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginLeft: 40,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#66B2FF",
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
});

export default UserItem;


import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

const NotificationButton = () => {
    return (
        <Link href="/notification" asChild>
            <Pressable style={{ marginRight: 16}}>
                <MaterialCommunityIcons name="bell-outline" size={24} color="#000" />
            </Pressable>
        </Link>
    )
}

export default NotificationButton;
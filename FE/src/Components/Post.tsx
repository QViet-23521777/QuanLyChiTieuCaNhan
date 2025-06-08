import React, { useState, useRef } from "react";
import { View, Pressable, Text, Animated, StyleSheet } from "react-native";
import UserItem from "./UserItem";
import TransactionItem from "./TransactionItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Comment from "./Comment";

const Post = () => {
    const [showComments, setShowComments] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current; // ban đầu chiều cao là 0

    const toggleComments = () => {
        if (!showComments) {
            // Mở: trượt lên
            setShowComments(true);
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            // Đóng: trượt xuống
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setShowComments(false);
            });
        }
    };

    const slideUp = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 0], // trượt từ dưới lên
    });

    const fadeIn = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1], // hiệu ứng mờ dần
    });

    return (
        <View>
            <View style={styles.card}>
                <UserItem />
                <Text style={styles.caption}>Đây là caption</Text>
                <TransactionItem
                    title="Thu nhập"
                    time="18:27 - 30/4"
                    amount="7500000"
                />

                <View style={styles.separator} />

                <View style={styles.actions}>
                    <Pressable style={styles.iconRow}>
                        <MaterialCommunityIcons
                            name="cards-heart-outline"
                            size={24}
                            color="#000"
                        />
                        <Text style={styles.iconText}>7</Text>
                    </Pressable>

                    <Pressable style={styles.iconRow} onPress={toggleComments}>
                        <MaterialCommunityIcons
                            name={showComments ? "comment" : "comment-outline"} // 👈 Đổi icon tại đây
                            size={24}
                            color="#000"
                        />
                        <Text style={styles.iconText}>3</Text>
                    </Pressable>
                </View>
            </View>

            {showComments && (
                <Animated.View
                    style={[
                        styles.commentContainer,
                        {
                            opacity: fadeIn,
                            transform: [{ translateY: slideUp }],
                        },
                    ]}>
                    <Comment />
                    <Comment />
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 30,
        padding: 16,
    },
    caption: {
        marginTop: 8,
        fontSize: 16,
    },
    separator: {
        height: 1,
        backgroundColor: "#fff",
        marginVertical: 8,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    iconRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconText: {
        marginLeft: 4,
        fontSize: 16,
    },
    commentContainer: {
        backgroundColor: "white",
        borderRadius: 30,
        padding: 16,
        marginTop: 16,
    },
});

export default Post;

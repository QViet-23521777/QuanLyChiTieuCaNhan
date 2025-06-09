/*import React, { useState, useRef, useEffect } from "react";
import { View, Pressable, Text, Animated, StyleSheet } from "react-native";
import UserItem from "./UserItem";
import TransactionItem from "./TransactionItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Commentt from "./Comment";
import CommentSection from "./Comment";import { User, SocialPost, Comment } from "@/models/types";
import { getCommentById, getCommentsByPostId } from '@/QuanLyTaiChinh-backend/commentServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById } from '@/QuanLyTaiChinh-backend/userServices'; // Giả sử  bạn đã định nghĩa các hàm này
import { getPostByFamilyId } from "@/QuanLyTaiChinh-backend/socialPost";  
const Post = ({ }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('userId');
            console.log('Fetched userId:', id);
            setUserId(id);
        };
        fetchUserId();
    }, []);
  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const fetchedUser = await getUserById(userId);
          console.log('Fetched user:', fetchedUser);
          setUser(fetchedUser);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    fetchUser();
  }, [userId]);
  useEffect(() => {
    const fetchPosts = async () => {
      if (userId) {
        try {
          const fetchedUser = await getUserById(userId);
          console.log('Fetched user:', fetchedUser);
          if (!fetchedUser) {
            console.error('User not found');
            return;
          }
          if( !fetchedUser.familyId) {
            console.log('User does not belong to any family');  
            return;
          }
          const fetchedPosts = await getPostByFamilyId(fetchedUser.familyId);
          console.log('Fetched posts:', fetchedPosts);
          setPosts(fetchedPosts || []);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    }
  }, [userId]);
  /* const toggleComments = () => {
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
  }; */

  /* const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0], // trượt từ dưới lên
  }); */

  /* const fadeIn = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1], // hiệu ứng mờ dần
  }); 

  return (
    <View>
      <View style={styles.card}>
        <UserItem />
        <Text style={styles.caption}>{content}</Text>
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

          <Pressable style={styles.iconRow}>
            <MaterialCommunityIcons
              name={"comment"} // 👈 Đổi icon tại đây
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
            /* {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            }, 
          ]}
        >
          <CommentSection />
          <CommentSection />
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

export default Post;*/

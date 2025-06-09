import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { User, SocialPost, Comment } from "@/models/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById } from '@/QuanLyTaiChinh-backend/userServices'; // Giả sử bạn đã định nghĩa các hàm này
import { getCommentById, getCommentsByPostId } from '@/QuanLyTaiChinh-backend/commentServices';
import { getPostBySocialPostId } from "@/QuanLyTaiChinh-backend/socialPost";
interface PostWithComments extends SocialPost {
  comments: Comment[];
}

const CommentSection = () => {
  const [userId, setUserId] = useState<string  | null>(null);
            const [user, setUser] = useState<User | null>(null);
      const [posts, setPosts] = useState<SocialPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [postsWithComments, setPostsWithComments] = useState<PostWithComments[]>([]);
  useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('userId');
            console.log('Fetched userId:', id); // Thêm dòng này
            setUserId(id);
        };
        fetchUserId();
    }, []);
    useEffect(() => {
    const fetchComments = async () => {
      if (userId) {
        try {
          // ✅ Lấy post IDs từ AsyncStorage
          const savedPostIds = await AsyncStorage.getItem('socialPostIds');
          
          if (!savedPostIds) {
            console.log('No saved post IDs found');
            return;
          }

          const postIds = JSON.parse(savedPostIds);
          console.log('Post IDs from AsyncStorage:', postIds);

          // ✅ Lấy comment cho từng post
          const allComments = [];
          for (const postId of postIds) {
            const postComments = await getCommentsByPostId(postId); // Giả sử bạn có function này
            if (postComments && postComments.length > 0) {
              allComments.push(...postComments);
            }
          }

          console.log('All comments:', allComments);
          setComments(allComments);

        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }
    };

    fetchComments();
  }, [userId]);
  
  return (
    <FlatList
      data={comments}
      renderItem={({ item }) => {
        return(
          <View style={styles.container}>
      <View style={styles.circle} />
      <View >
        <Text style={styles.name}>item.username</Text>
        <Text>item.text</Text>
      </View>
    </View>
        )
      }}/>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fff4', // màu nền giống ảnh
    padding: 10,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25, // tạo hình tròn
    backgroundColor: '#66B2FF', // màu xanh dương
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    color: '#111827', // màu chữ giống ảnh
    fontWeight: '500',
  },
});

export default CommentSection;

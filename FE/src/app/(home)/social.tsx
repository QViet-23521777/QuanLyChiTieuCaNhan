import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import mainStyles from '@/src/styles/mainStyle';
// Sửa lỗi import Post - có thể cần thay đổi tùy theo cách export của Post component
// import Post from '@/src/Components/Post'; // Bỏ dòng này nếu không sử dụng
import { useRouter } from 'expo-router';
import { useCategory } from '@/src/context/categoryContext';
import React, { useState, useEffect } from "react";
import { User, SocialPost, Comment } from "@/models/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPostByFamilyId } from '@/QuanLyTaiChinh-backend/socialPost';
import { getUserById } from '@/QuanLyTaiChinh-backend/userServices';
import { getCommentById, getCommentsByPostId } from '@/QuanLyTaiChinh-backend/commentServices';
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Thêm type để xử lý Timestamp từ Firebase
interface FirebaseTimestamp {
  toDate(): Date;
  seconds: number;
  nanoseconds: number;
}

interface PostWithComments extends SocialPost {
  comments: Comment[];
}

// Đã chuyển các state này vào bên trong PostItem component để sử dụng biến post đúng scope

// Component để render từng comment
const CommentItem = ({ comment }: { comment: Comment }) => {
  const formatDate = (date: Date | FirebaseTimestamp | string | number) => {
    if (!date) return '';
    
    let d: Date;
    
    // Xử lý các loại date khác nhau
    if (typeof date === 'object' && 'toDate' in date) {
      // Firebase Timestamp
      d = (date as FirebaseTimestamp).toDate();
    } else if (date instanceof Date) {
      // JavaScript Date object
      d = date;
    } else {
      // String hoặc number
      d = new Date(date);
    }
    
    return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentAuthor}>{comment.userName}</Text>
        <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
      </View>
      <Text style={styles.commentText}>{comment.text}</Text>
    </View>
  );
};

// Component để render từng post với thông tin chi tiết

const PostItem = ({ post, comments }: { post: SocialPost, comments: Comment[] }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.numlike || 0);

  const handleLikePress = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };
  const formatDate = (date: Date | FirebaseTimestamp | string | number) => {
    
    let d: Date;
    
    // Xử lý các loại date khác nhau
    if (typeof date === 'object' && 'toDate' in date) {
      // Firebase Timestamp
      d = (date as FirebaseTimestamp).toDate();
    } else if (date instanceof Date) {
      // JavaScript Date object
      d = date;
    } else {
      // String hoặc number
      d = new Date(date);
    }
    
    return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPostTypeText = (type: string) => {
    switch(type) {
      case 'photo': return 'Ảnh';
      case 'expense': return 'Chi tiêu';
      case 'achievement': return 'Thành tích';
      default: return type;
    }
  };

  return (
    <View style={styles.postContainer}>
      {/* Header của post */}
      <View style={styles.postHeader}>
        <View style={styles.postHeaderLeft}>
          <Text style={styles.postAuthor}>{post.createdByName}</Text>
          <View style={styles.postMeta}>
            <Text style={styles.postType}>{getPostTypeText(post.type)}</Text>
            <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.postHeaderRight}>
          <Text style={styles.postVisibility}>
            {post.isPublic ? 'Công khai' : 'Riêng tư'}
          </Text>
        </View>
      </View>

      {/* Nội dung post */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Thông tin về photos và transactions nếu có */}
      {post.photoId && post.photoId.length > 0 && (
        <View style={styles.postInfo}>
          <Text style={styles.postInfoText}>
            📷 {post.photoId.length} ảnh
          </Text>
        </View>
      )}

      {post.transactionId && post.transactionId.length > 0 && (
        <View style={styles.postInfo}>
          <Text style={styles.postInfoText}>
            💰 {post.transactionId.length} giao dịch
          </Text>
        </View>
      )}

      {/* Thống kê likes và comments */}
      <View style={styles.postStats}>
        <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={handleLikePress}
      >
        <MaterialCommunityIcons
          name={liked ? 'cards-heart' : 'cards-heart-outline'}
          size={24}
          color={liked ? 'red' : '#000'}
        />
        <Text style={styles.postStatsText}>{likeCount}</Text>
      </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
              name={"comment"} // 👈 Đổi icon tại đây
              size={24}
              color="#000"
            />
        <Text style={styles.postStatsText}>
           {post.numcom || 0}
        </Text>
        </View>
      </View>

      {/* Nút hiển thị/ẩn comments */}
      {comments.length > 0 && (
        <TouchableOpacity 
          style={styles.showCommentsButton}
          onPress={() => setShowComments(!showComments)}
        >
          <Text style={styles.showCommentsText}>
            {showComments ? 'Ẩn bình luận' : `Xem ${comments.length} bình luận`}
          </Text>
        </TouchableOpacity>
      )}

      {/* Danh sách comments */}
      {showComments && comments.length > 0 && (
        <View style={styles.commentsSection}>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </View>
      )}
    </View>
  );
};

const SocialScreen = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [postsWithComments, setPostsWithComments] = useState<PostWithComments[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('userId');
            console.log('Fetched userId:', id);
            setUserId(id);
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchPostsAndComments = async () => {
            if (userId) {
                setLoading(true);
                try {
                    const u = await getUserById(userId);
                    console.log('Fetched user:', u);
                    setUser(u);
                    
                    if (!u) {
                        console.error('User not found');
                        return;
                    }
                    
                    if (!u.familyId) {
                        console.log('User does not belong to any family');
                        return;
                    }

                    const posts = await getPostByFamilyId(u.familyId);
                    console.log('Fetched posts:', posts);
                    
                    if (!posts || posts.length === 0) {
                        console.log('No posts found for this family');
                        setPostsWithComments([]);
                        return;
                    }

                    // Lấy comments cho từng post và kết hợp
                    const postsWithCommentsData = await Promise.all(
                        posts.map(async (post) => {
                            try {
                              console.log(`Fetching comments for post ${post.id}`);
                                const comments = await getCommentsByPostId(post.id);
                                console.log(`Comments for post ${post.id}:`, comments);
                                return {
                                    ...post,
                                    comments: comments || []
                                };
                            } catch (error) {
                                console.error(`Error fetching comments for post ${post.id}:`, error);
                                return {
                                    ...post,
                                    comments: []
                                };
                            }
                        })
                    );

                    console.log('Posts with comments:', postsWithCommentsData);
                    // Sắp xếp posts theo thời gian mới nhất
                    const sortedPosts = postsWithCommentsData.sort((a, b) => {
                        const getTime = (date: Date | FirebaseTimestamp | string | number): number => {
                            if (typeof date === 'object' && 'toDate' in date) {
                                return (date as FirebaseTimestamp).toDate().getTime();
                            } else if (date instanceof Date) {
                                return date.getTime();
                            } else {
                                return new Date(date).getTime();
                            }
                        };

                        return getTime(b.createdAt) - getTime(a.createdAt);
                    });
                    setPostsWithComments(sortedPosts);
                } catch (error) {
                    console.error('Error fetching posts and comments:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPostsAndComments();
    }, [userId]);

    return (
        <SafeAreaView style={mainStyles.container}>
            <SafeAreaView style={[mainStyles.topSheet, {padding: 0}]}/>
            <View style={[mainStyles.bottomeSheet, {backgroundColor: 'transparent'}]}>
                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Đang tải...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={postsWithComments}
                        keyExtractor={(item, index) => item.id || index.toString()}
                        renderItem={({ item }) => (
                            <PostItem 
                                post={item} 
                                comments={item.comments} 
                            />
                        )}
                        contentContainerStyle={{ paddingTop: 10 }}
                        ListEmptyComponent={() => (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <Text>Chưa có bài đăng nào</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postHeaderLeft: {
    flex: 1,
  },
  postHeaderRight: {
    alignItems: 'flex-end',
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  postType: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  postVisibility: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 12,
  },
  postInfo: {
    marginBottom: 8,
  },
  postInfoText: {
    fontSize: 12,
    color: '#666',
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  postStatsText: {
    fontSize: 15,
    color: '#666',
  },
  showCommentsButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
  showCommentsText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  commentContainer: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#333',
  },
});

export default SocialScreen;
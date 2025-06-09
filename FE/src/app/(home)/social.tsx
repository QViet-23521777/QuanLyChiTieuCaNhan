import { SafeAreaView } from 'react-native-safe-area-context';
import { View, FlatList } from 'react-native';
import mainStyles from '@/src/styles/mainStyle';
import Post from '@/src/Components/Post';
import { useRouter } from 'expo-router';
import { useCategory } from '@/src/context/categoryContext';

const SocialScreen = () => {
    const router = useRouter();
    const { posts, loading } = useCategory();
    return(
        <SafeAreaView style={mainStyles.container}>
            <SafeAreaView style={[mainStyles.topSheet, {padding: 0}]}/>
            <View style={[mainStyles.bottomeSheet, {backgroundColor: 'transparent'}]}>
                <FlatList
                data={posts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    let formattedTime = "";

                    if (item.date?.toDate) {
                        formattedTime = item.date
                            .toDate()
                            .toLocaleString("vi-VN");
                    } else if (item.date instanceof Date) {
                        formattedTime = item.date.toLocaleString("vi-VN");
                    } else {
                        formattedTime = String(item.date); // fallback
                    }

                    return (
                        <Post
                            content={item.content}
                        />
                    );
                }}
                contentContainerStyle={{ paddingTop: 10 }}
            />
            </View>
        </SafeAreaView>
    )
}

export default SocialScreen
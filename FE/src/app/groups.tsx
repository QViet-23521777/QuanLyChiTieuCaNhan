// import { View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import mainStyles from '@/src/styles/mainStyle';
// import GroupItem from '@/src/Components/GroupItem';

// const GroupsScreen = () => {
//     return (
//         <SafeAreaView style={mainStyles.container}>
//             <SafeAreaView style={[mainStyles.topSheet, { padding: 0 }]} />
//             <View style={mainStyles.bottomeSheet}>
//                 <GroupItem />
//             </View>
//         </SafeAreaView>
//     )
// }

// export default GroupsScreen;

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import mainStyles from '@/src/styles/mainStyle';
import GroupItem from '@/src/Components/GroupItem';

interface User {
  name: string;
}

interface Group {
  id: string;
  groupName: string;
  users: User[];
}

const GroupsScreen: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      groupName: "Group 1",
      users: Array(4).fill({ name: "Nguyen Van A" }),
    },
    { id: '2', groupName: "Group 2", users: [] },
    { id: '3', groupName: "Group 2", users: [] },
    { id: '4', groupName: "Group 2", users: [] },
  ]);

  const handleDeleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(group => group.id !== groupId));
  };

  const handleDeleteUser = (groupId: string, userIndex: number) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              users: group.users.filter((_, index) => index !== userIndex),
            }
          : group
      )
    );
  };

  return (
    <SafeAreaView style={mainStyles.container}>
      <SafeAreaView style={[mainStyles.topSheet, { padding: 0 }]} />
      <View style={mainStyles.bottomeSheet}>
        {groups.map((group) => (
          <GroupItem
            key={group.id}
            groupId={group.id}
            groupName={group.groupName}
            users={group.users}
            onDeleteGroup={handleDeleteGroup}
            onDeleteUser={handleDeleteUser}
          />
        ))}

        {/* <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#66B2FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GroupsScreen;


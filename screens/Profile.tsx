// src/screens/Profile.tsx

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, CallItem } from '../App';

type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;
type ProfileNavProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavProp>();
  const route = useRoute<ProfileRouteProp>();
  const { contact } = route.params;

  // 예시 대화 목록 (하드코딩)
  const messages = [
    '캡스톤 과제에 대한 이야기',
    '학식이 맛있다는 것에 대한 이야기',
    '요즘 일몰이 예쁘다는 것에 대한 이야기',
    '내일 만나서 과제를 하자는 이야기',
  ];

  // 예시 태그 배열
  const tags = ['#과제', '#학식', '#일몰', '#일정'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {contact.name} {contact.id}
        </Text>

        {/* 오른쪽 빈 공간 (제목 중앙 정렬용) */}
        <View style={styles.closeButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 프로필 이미지 */}
        <Image
          source={require('../assets/fisher.png')}
          style={styles.profileImage}
          resizeMode="cover"
        />

        {/* 좋아요 버튼만 남겨두고 “음성 업로드” 버튼 제거 */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="heart-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {/* 통화 정보: 날짜, 제목, 통화 길이 */}
        <View style={styles.infoContainer}>
          <Text style={styles.callDate}>4월 3일 오전 10시 21분</Text>
          <Text style={styles.callTitle}>캡스톤 과제에 대한 이야기</Text>
          <Text style={styles.callMeta}>발신 전화 | 3분 27초</Text>
        </View>

        {/* 대화 내용 목록 */}
        <View style={styles.messageList}>
          {messages.map((msg, idx) => (
            <View key={idx} style={styles.messageItem}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={styles.messageText}>{msg}</Text>
            </View>
          ))}
        </View>

        {/* 통화 태그 */}
        <View style={styles.tagContainer}>
          <Text style={styles.tagLabel}>통화 태그</Text>
          <View style={styles.tagList}>
            {tags.map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* “통화 내용 자세히 보기” 버튼 → Chat 화면으로 이동 */}
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => navigation.navigate('Chat', { contact })}
        >
          <Text style={styles.detailButtonText}>통화 내용 자세히 보기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 12,
  },
  closeButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    paddingBottom: 24,
  },
  profileImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F0F0F0',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButton: {
    marginLeft: 16,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  callDate: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  callTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  callMeta: {
    fontSize: 12,
    color: '#999999',
  },
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 8,
    color: '#333333',
    marginRight: 8,
    lineHeight: 18,
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    lineHeight: 18,
  },
  tagContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tagLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#333333',
  },
  detailButton: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#0066FF',
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

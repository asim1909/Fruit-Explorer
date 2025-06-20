import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';

const LOGO_URL = 'https://i.pinimg.com/originals/a1/2f/6d/a12f6df44709e908b9e03e68e7bff6c6.png';
const API_URL = 'https://www.fruityvice.com/api/fruit/all';

const CARD_COLORS = ['#ffe4e1', '#e6e6fa', '#e0ffff', '#fffacd', '#f0fff0', '#f5f5dc'];

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.splashContainer}>
      <Image
        source={{ uri: LOGO_URL }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.splashText}>Fruit Explorer</Text>
    </View>
  );
};

const FruitCard = ({ item, isSelected, onPress, index }) => (
  <TouchableOpacity
    style={[
      styles.card,
      { backgroundColor: CARD_COLORS[index % CARD_COLORS.length] },
      isSelected && styles.selectedCard,
    ]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <Text style={[styles.cardTitle, isSelected && styles.selectedTitle]}>
      {item.name}
    </Text>
    <Text style={styles.cardFamily}>{item.family}</Text>
    {isSelected && (
      <View style={styles.cardDetails}>
        <Text style={styles.cardDetailText}>Genus: {item.genus}</Text>
        <Text style={styles.cardDetailText}>Order: {item.order}</Text>
        <Text style={styles.cardDetailText}>
          Calories: {item.nutritions.calories} | Sugar: {item.nutritions.sugar}g
        </Text>
        <Text style={styles.cardDetailText}>
          Carbs: {item.nutritions.carbohydrates}g | Protein: {item.nutritions.protein}g | Fat: {item.nutritions.fat}g
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

const MainApp = () => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setFruits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredData = fruits.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item, index }) => {
    const isSelected = item.id === selectedId;
    return (
      <FruitCard
        item={item}
        isSelected={isSelected}
        onPress={() => setSelectedId(isSelected ? null : item.id)}
        index={index}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b0082" />
        <Text style={{ marginTop: 16, color: '#4b0082' }}>Loading fruits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍉 Fruit Explorer 🍉</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search fruits..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredData}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No fruits found!</Text>
        }
      />
    </View>
  );
};

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#fef7e8', // Softer cream background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 160, // Slightly larger for prominence
    height: 160,
    marginBottom: 24,
    borderRadius: 20, // Rounded logo for modern feel
  },
  splashText: {
    fontSize: 36, // Larger for impact
    fontWeight: '700', // Bolder but modern
    color: '#3b0764', // Deeper purple for elegance
    letterSpacing: 1.2,
    fontFamily: 'System', // Clean system font
  },
  container: {
    flex: 1,
    paddingTop: 48, // More breathing room
    backgroundColor: '#f5f6ff', // Light lavender background
  },
  header: {
    fontSize: 30, // Slightly larger for hierarchy
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#3b0764',
    letterSpacing: 1.1,
    fontFamily: 'System',
  },
  searchBar: {
    height: 44, // Taller for better touch
    borderColor: '#d1d5db', // Softer gray border
    borderWidth: 1,
    borderRadius: 16, // More rounded for modern look
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    fontSize: 16,
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    gap: 12, // Modern spacing with gap
  },
  card: {
    width: CARD_WIDTH,
    minHeight: 120, // Slightly taller for balance
    borderRadius: 18, // Softer, modern corners
    marginBottom: 20,
    padding: 16,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    shadowColor: '#000', // Subtle shadow for elevation
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 0, // Remove border for cleaner look
  },
  selectedCard: {
    backgroundColor: '#fff1f3', // Light pink for selection
    shadowColor: '#d72660',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22, // Larger for emphasis
    fontWeight: '600',
    color: '#3b0764',
    marginBottom: 6,
    fontFamily: 'System',
  },
  selectedTitle: {
    color: '#c2185b', // Vibrant pink for selected state
    fontWeight: '700',
  },
  cardFamily: {
    fontSize: 15, // Slightly larger for readability
    color: '#6b7280', // Neutral gray for secondary text
    marginBottom: 6,
    fontFamily: 'System',
  },
  cardDetails: {
    marginTop: 10,
  },
  cardDetailText: {
    fontSize: 14, // Larger for clarity
    color: '#374151', // Darker gray for contrast
    marginBottom: 4,
    lineHeight: 20, // Better readability
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 20, // Slightly larger for emphasis
    color: '#9ca3af', // Softer gray for empty state
    fontFamily: 'System',
    lineHeight: 28,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6ff', // Match container background
  },
});


const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return showSplash ? (
    <SplashScreen onFinish={() => setShowSplash(false)} />
  ) : (
    <MainApp />
  );
};

export default App;
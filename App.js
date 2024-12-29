import React, { useState } from "react";
import { Text, View, TextInput, Button, StyleSheet, ScrollView, Image } from "react-native";
import { Card, Avatar } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const API_URL = "http://192.168.56.1:3000";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [userData, setUserData] = useState(null); // State untuk menyimpan data user

  // Layar Register
  function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
    const handleRegister = async () => {
      try {
        const response = await axios.post("http://192.168.56.1:3000/register", {
          username,
          password,
        });
        alert(response.data.message);
        navigation.navigate("Login");
      } catch (error) {
        alert("Registration failed!");
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Register" onPress={handleRegister} />
      </View>
    );
  }

  // Layar Login
  function LoginScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
    const handleLogin = async () => {
      try {
        // Perbaiki URL API
        const response = await axios.post("http://192.168.56.1:3000/login", {
          username,
          password,
        });
  
        if (response.data.message) {
          setUserData({ username, password });
          navigation.replace("Main");
        }
      } catch (error) {
        alert("Login failed! " + error.response.data.message);
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    );
  }

  // Layar Home
  function HomeScreen() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to Home</Text>
          <Image
            source={{ uri: "https://source.unsplash.com/random/300x200" }}
            style={styles.image}
          />
          <Text style={styles.subtitle}>Latest News</Text>
          <Card style={styles.card}>
            <Card.Cover source={{ uri: "https://source.unsplash.com/random/400x300" }} />
            <Card.Content>
              <Text style={styles.cardTitle}>Breaking News</Text>
              <Text>Discover the latest updates in technology, science, and art.</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    );
  }

  // Layar Explore
  function ExploreScreen() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Explore New Ideas</Text>
          <View style={styles.grid}>
            {[...Array(6)].map((_, index) => (
              <Card key={index} style={styles.gridItem}>
                <Card.Cover source={{ uri: `https://source.unsplash.com/random/200x200?sig=${index}` }} />
                <Card.Content>
                  <Text style={styles.cardTitle}>Explore {index + 1}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  // Layar Profile
  function ProfileScreen() {
    return (
      <View style={styles.container}>
        <Avatar.Image
          size={100}
          source={{ uri: "https://source.unsplash.com/random/200x200" }}
          style={{ marginBottom: 20 }}
        />
        <Text style={styles.title}>Hello, {userData?.username || "User"}!</Text>
        <Text style={styles.subtitle}>Welcome to your profile page.</Text>
        <Card style={styles.card}>
          <Card.Content>
            <Text>Username: {userData?.username}</Text>
            <Text>Posts Created: 5</Text>
            <Text>Followers: 120</Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  // Tab Navigasi Utama
  function MainTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Explore") {
              iconName = "explore";
            } else if (route.name === "Profile") {
              iconName = "person";
            }
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    );
  }

  // Navigasi Utama
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Gaya
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    marginBottom: 10,
  },
});

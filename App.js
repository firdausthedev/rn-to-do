import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  StatusBar,
  StyleSheet,
  View,
  Pressable,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [textInput, setTextInput] = useState('');

  const getGoals = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('goal');
      if (jsonValue == null) {
        return [];
      } else {
        return JSON.parse(jsonValue);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [goals, setGoals] = useState([]);

  const textInputHandler = (e) => {
    setTextInput(e);
  };

  const goalsHandlder = () => {
    if (textInput.length > 0) {
      const newGoals = [...goals];
      newGoals.push({ goal: textInput, id: uuid.v4() });
      setGoals(newGoals);
      storeGoals(newGoals);
      setTextInput('');
      Keyboard.dismiss();
    }
  };

  const deleteGoalHandler = (item) => {
    const oldGoals = [...goals];
    const newGoals = oldGoals.filter((goal) => goal.id != item.id);
    setGoals(newGoals);
    storeGoals(newGoals);
  };

  const storeGoals = async (goal) => {
    try {
      const jsonValue = JSON.stringify(goal);
      await AsyncStorage.setItem('goal', jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(async () => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    let obj = await getGoals();
    setGoals(obj);
  }, []);

  return (
    <SafeAreaView style={styles.body}>
      <StatusBar
        animated={true}
        backgroundColor={'#000'}
        barStyle="light-content"
      />
      <View style={[styles.container, styles.inputContainer]}>
        <TextInput
          clearButtonMode="always"
          style={styles.textInput}
          placeholder="Enter Goal..."
          placeholderTextColor="#ccc"
          value={textInput}
          onChangeText={(e) => textInputHandler(e)}
        ></TextInput>
        <Pressable onPress={goalsHandlder}>
          <View style={styles.addButton}>
            <Text style={styles.addText}>+</Text>
          </View>
        </Pressable>
      </View>
      <View>
        <FlatList
          style={[styles.container, styles.goalsContainer]}
          data={goals}
          keyExtractor={(goal) => goal.id}
          renderItem={({ item }) => {
            return (
              <Pressable
                onPress={() => {
                  deleteGoalHandler(item);
                }}
              >
                <View style={styles.goalContainer}>
                  <Text style={styles.goalText}>{item.goal}</Text>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    color: 'white',

    padding: 10,
    flex: 1,
  },
  container: {
    width: 300,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    height: 40,
  },
  addButton: {
    backgroundColor: '#54BAB9',
    flex: 1,
    width: 50,
    borderRadius: 7,
    elevation: 4,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: 25,
    marginTop: 0,
    color: 'black',
  },
  goalsContainer: {
    marginTop: 20,
  },
  goalContainer: {
    backgroundColor: '#333333',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  goalText: {
    color: 'white',
  },
});

export default App;

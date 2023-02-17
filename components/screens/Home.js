import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StatusBar, Text, TouchableOpacity, View,} from 'react-native';
import {COLOURS} from '../database/Color';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = ({ navigation }) => {
  const [products, setProducts] = useState([]);

  //get called on screen loads
  useEffect(() => {
    return navigation.addListener('focus', () => {
      getProducts().then((resp) => {
        filterProducts(resp);
      })
    });
  }, [navigation]);

  async function getProducts() {
    try {
      const response = await fetch('https://www.amiiboapi.com/api/amiibo/');
      const responseJson = await response.json();
      return responseJson["amiibo"];
    } catch (error) {
      console.error(error);
    }
  }

  const filterProducts = (response) => {
    const elements = response.slice(0, 20);
    const limit = elements.length;
    let productList = [];

    for (let index = 0; index < limit; index++) {
      elements[index]['productPrice'] = generatePrice();
      elements[index]['amount'] = 1;
      productList.push(elements[index]);
    }
    setProducts(productList);
  };

  const generatePrice = () => {
    const randomNumber = Math.floor(Math.random() * 9901) + 1000;
    const roundedNumber = Math.round(randomNumber / 10) * 10;
    return roundedNumber;
  };

  //create a product reusable card
  const ProductCard = ({ data }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductInfo', { product: data })}
        style={{
          width: '48%',
          marginVertical: 14,
        }}>
        <View
          style={{
            width: '100%',
            height: 100,
            borderRadius: 10,
            backgroundColor: COLOURS.backgroundLight,
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
          }}>
          <Image
            source={{
              uri: data.image,
            }}
            style={{
              width: '80%',
              height: '80%',
              resizeMode: 'contain',
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 12,
            color: COLOURS.black,
            fontWeight: '600',
            marginBottom: 2,
          }}>
          {data.name}
        </Text>

        <Text>${data.productPrice}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLOURS.white,
      }}>
      <StatusBar backgroundColor={COLOURS.white} barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 16,
            marginTop: 35
          }}>
          <TouchableOpacity>
            <Entypo
              name="shopping-bag"
              style={{
                fontSize: 18,
                color: COLOURS.backgroundMedium,
                padding: 12,
                borderRadius: 10,
                backgroundColor: COLOURS.backgroundLight,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MyCart')}>
            <MaterialCommunityIcons
              name="cart"
              style={{
                fontSize: 18,
                color: COLOURS.backgroundMedium,
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: COLOURS.backgroundLight,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginBottom: 10,
            padding: 16,
          }}>
          <Text
            style={{
              fontSize: 26,
              color: COLOURS.black,
              fontWeight: '500',
              letterSpacing: 1,
              marginBottom: 10,
            }}>
            E-COMMERCE
          </Text>
        </View>
        <View
          style={{
            padding: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: COLOURS.black,
                  fontWeight: '500',
                  letterSpacing: 1,
                }}>
                Products
              </Text>
            </View>

          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
            }}>
            {products.map(data => {
              return <ProductCard data={data} key={data.tail} />;
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

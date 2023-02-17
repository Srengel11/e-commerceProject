import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLOURS} from '../database/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from "react-native-root-toast";

const MyCart = ({navigation}) => {
  const [product, setProduct] = useState();
  const [total, setTotal] = useState(null);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      getDataFromDB().then();
    });
  }, [navigation]);

  const getDataFromDB = async () => {
    let items = await AsyncStorage.getItem('cartItems');
    items = JSON.parse(items);
    console.log(items)
    if (items) {
      setProduct(items);
      getTotal(items);
    } else {
      setProduct(null);
      getTotal(false);
    }
  };

  //get total price of all items in the cart
  const getTotal = productData => {
    const limit = productData.length;
    let total = 0;

    for (let index = 0; index < limit; index++) {
      let productPrice = productData[index].productPrice;
      let productAmount = productData[index].amount;
      total += productPrice * productAmount;
    }
    setTotal(total);
  };

  async function getProducts() {
    let itemArray = await AsyncStorage.getItem('cartItems');
    return JSON.parse(itemArray);
  }

  async function updateProduct(array) {
    await AsyncStorage.setItem('cartItems', JSON.stringify(array));
    getDataFromDB().then();
  }

//remove data from Cart
  const removeItemFromCart = async id => {
    let itemArray = await getProducts();

    if (itemArray) {
      let array = itemArray;
      for (let index = 0; index < array.length; index++) {
        if (array[index]['tail'] === id) {
          array.splice(index, 1);
        }
        await updateProduct(array);
      }
    }
  };

  const minusAmount = async id => {
    let itemArray = await getProducts();

    if (itemArray) {
      let array = itemArray;
      for (let index = 0; index < array.length; index++) {
        if (array[index]['tail'] === id) {
          array[index]['amount'] -= 1;
        }
        if (array[index]['amount'] < 1) {
          await removeItemFromCart(array[index]['tail']);
        } else {
          await updateProduct(array);
        }

      }
    }
  };

  const plusAmount = async id => {
    let itemArray = await getProducts();

    if (itemArray) {
      let array = itemArray;
      for (let index = 0; index < array.length; index++) {
        if (array[index]['tail'] === id) {
          array[index]['amount'] += 1;
        }
        await updateProduct(array);
      }
    }
  };

  //checkout
  const checkOut = async () => {
    try {
      await AsyncStorage.removeItem('cartItems');
    } catch (error) {
      return error;
    }

    Toast.show('Items will be Deliverd SOON!', {
      duration: Toast.durations.SHORT,
    });

    navigation.navigate('Home');
  };

  const renderProducts = (data) => {
    return (
        <TouchableOpacity
            key={data.tail}
            onPress={() => navigation.navigate('ProductInfo', {product: data})}
            style={{
              width: '100%',
              height: 100,
              marginVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
          <View
              style={{
                width: '30%',
                height: 100,
                padding: 14,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLOURS.backgroundLight,
                borderRadius: 10,
                marginRight: 22,
              }}>
            <Image
                source={{
                  uri: data.image,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                }}
            />
          </View>
          <View
              style={{
                flex: 1,
                height: '100%',
                justifyContent: 'space-around',
              }}>
            <View style={{}}>
              <Text
                  style={{
                    fontSize: 14,
                    maxWidth: '100%',
                    color: COLOURS.black,
                    fontWeight: '600',
                    letterSpacing: 1,
                  }}>
                {data.name}
              </Text>
              <View
                  style={{
                    marginTop: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    opacity: 0.6,
                  }}>
                <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '400',
                      maxWidth: '85%',
                      marginRight: 4,
                    }}>
                  ${data.productPrice}
                </Text>
              </View>
            </View>
            <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
              <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                <View
                    style={{
                      borderRadius: 100,
                      marginRight: 20,
                      padding: 4,
                      borderWidth: 1,
                      borderColor: COLOURS.backgroundMedium,
                      opacity: 0.5,
                    }}>
                  <TouchableOpacity onPress={() => minusAmount(data.tail)}>
                    <MaterialCommunityIcons
                        name="minus"
                        style={{
                          fontSize: 16,
                          color: COLOURS.backgroundDark,
                        }}
                    />
                  </TouchableOpacity>
                </View>
                <Text>{data.amount}</Text>
                <View
                    style={{
                      borderRadius: 100,
                      marginLeft: 20,
                      padding: 4,
                      borderWidth: 1,
                      borderColor: COLOURS.backgroundMedium,
                      opacity: 0.5,
                    }}>
                  <TouchableOpacity onPress={() => plusAmount(data.tail)}>
                    <MaterialCommunityIcons
                        name="plus"
                        style={{
                          fontSize: 16,
                          color: COLOURS.backgroundDark,
                        }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeItemFromCart(data.tail)}>
                <MaterialCommunityIcons
                    name="delete-outline"
                    style={{
                      fontSize: 16,
                      color: COLOURS.backgroundDark,
                      backgroundColor: COLOURS.backgroundLight,
                      padding: 8,
                      borderRadius: 100,
                    }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
    );
  };

  return (
      <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: COLOURS.white,
            position: 'relative',
          }}>
        <ScrollView>
          <View
              style={{
                width: '100%',
                flexDirection: 'row',
                paddingTop: 16,
                paddingHorizontal: 16,
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 35
              }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                  name="chevron-left"
                  style={{
                    fontSize: 18,
                    color: COLOURS.backgroundDark,
                    padding: 12,
                    backgroundColor: COLOURS.backgroundLight,
                    borderRadius: 12,
                  }}
              />
            </TouchableOpacity>
            <Text
                style={{
                  fontSize: 14,
                  color: COLOURS.black,
                  fontWeight: '400',
                }}>
              Order Details
            </Text>
            <View></View>
          </View>
          <Text
              style={{
                fontSize: 20,
                color: COLOURS.black,
                fontWeight: '500',
                letterSpacing: 1,
                paddingTop: 20,
                paddingLeft: 16,
                marginBottom: 10,
              }}>
            My Cart
          </Text>
          <View style={{paddingHorizontal: 16}}>
            {product ? product.map(renderProducts) : null}
          </View>
          <View>
            <View
                style={{
                  paddingHorizontal: 16,
                  marginVertical: 10,
                }}>
              <Text
                  style={{
                    fontSize: 16,
                    color: COLOURS.black,
                    fontWeight: '500',
                    letterSpacing: 1,
                    marginBottom: 20,
                  }}>
                Delivery Location
              </Text>
              <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                <View
                    style={{
                      flexDirection: 'row',
                      width: '80%',
                      alignItems: 'center',
                    }}>
                  <View
                      style={{
                        color: COLOURS.blue,
                        backgroundColor: COLOURS.backgroundLight,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 12,
                        borderRadius: 10,
                        marginRight: 18,
                      }}>
                    <MaterialCommunityIcons
                        name="truck-delivery-outline"
                        style={{
                          fontSize: 18,
                          color: COLOURS.blue,
                        }}
                    />
                  </View>
                  <View>
                    <Text
                        style={{
                          fontSize: 14,
                          color: COLOURS.black,
                          fontWeight: '500',
                        }}>
                      Camino del monte.
                    </Text>
                    <Text
                        style={{
                          fontSize: 12,
                          color: COLOURS.black,
                          fontWeight: '400',
                          lineHeight: 20,
                          opacity: 0.5,
                        }}>
                      6300, La Florida. Santiago
                    </Text>
                  </View>
                </View>
                <MaterialCommunityIcons
                    name="chevron-right"
                    style={{fontSize: 22, color: COLOURS.black}}
                />
              </View>
            </View>
            <View
                style={{
                  paddingHorizontal: 16,
                  marginVertical: 10,
                }}>
              <Text
                  style={{
                    fontSize: 16,
                    color: COLOURS.black,
                    fontWeight: '500',
                    letterSpacing: 1,
                    marginBottom: 20,
                  }}>
                Payment Method
              </Text>
              <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                <View
                    style={{
                      flexDirection: 'row',
                      width: '80%',
                      alignItems: 'center',
                    }}>
                  <View
                      style={{
                        color: COLOURS.blue,
                        backgroundColor: COLOURS.backgroundLight,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 12,
                        borderRadius: 10,
                        marginRight: 18,
                      }}>
                    <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '900',
                          color: COLOURS.blue,
                          letterSpacing: 1,
                        }}>
                      VISA
                    </Text>
                  </View>
                  <View>
                    <Text
                        style={{
                          fontSize: 14,
                          color: COLOURS.black,
                          fontWeight: '500',
                        }}>
                      Visa Classic
                    </Text>
                    <Text
                        style={{
                          fontSize: 12,
                          color: COLOURS.black,
                          fontWeight: '400',
                          lineHeight: 20,
                          opacity: 0.5,
                        }}>
                      ****-9092
                    </Text>
                  </View>
                </View>
                <MaterialCommunityIcons
                    name="chevron-right"
                    style={{fontSize: 22, color: COLOURS.black}}
                />
              </View>
            </View>
            <View
                style={{
                  paddingHorizontal: 16,
                  marginTop: 40,
                  marginBottom: 80,
                }}>
              <Text
                  style={{
                    fontSize: 16,
                    color: COLOURS.black,
                    fontWeight: '500',
                    letterSpacing: 1,
                    marginBottom: 20,
                  }}>
                Order Info
              </Text>
              <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}>
                <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '400',
                      maxWidth: '80%',
                      color: COLOURS.black,
                      opacity: 0.5,
                    }}>
                  Subtotal
                </Text>
                <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '400',
                      color: COLOURS.black,
                      opacity: 0.8,
                    }}>
                  ${total}
                </Text>
              </View>
              <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 22,
                  }}>
                <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '400',
                      maxWidth: '80%',
                      color: COLOURS.black,
                      opacity: 0.5,
                    }}>
                  Shipping Tax
                </Text>
                <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '400',
                      color: COLOURS.black,
                      opacity: 0.8,
                    }}>
                  $ {total / 20}
                </Text>
              </View>
              <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '400',
                      maxWidth: '80%',
                      color: COLOURS.black,
                      opacity: 0.5,
                    }}>
                  Total
                </Text>
                <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '500',
                      color: COLOURS.black,
                    }}>
                  ${total + total / 20}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View
            style={{
              position: 'absolute',
              bottom: 10,
              height: '8%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
          <TouchableOpacity
              onPress={() => (total !== 0 ? checkOut() : null)}
              style={{
                width: '86%',
                height: '90%',
                backgroundColor: COLOURS.blue,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
            <Text
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  letterSpacing: 1,
                  color: COLOURS.white,
                  textTransform: 'uppercase',
                }}>
              CHECKOUT ($ {total + total / 20} )
            </Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

export default MyCart;

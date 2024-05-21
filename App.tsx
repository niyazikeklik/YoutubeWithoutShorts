/* eslint-disable prettier/prettier */
import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {BackHandler, ToastAndroid} from 'react-native';
import WebView from 'react-native-webview';

function App(): React.JSX.Element {
  const javascriptInjection = `
      function removeAllShorts() {
        var element = document.querySelector('[class*="pivot-shorts"]');
        if (element) {
          element.parentElement.remove();
        }
        var element2 = document.querySelector('[class="ShortsLockupViewModelHost"]');
        if (element2) {
          element2.parentElement.parentElement.parentElement.parentElement.remove();
        }
      }
      window.addEventListener('navigate', ()=> {
        setTimeout(()=> removeAllShorts(), 50);
      });
      removeAllShorts();
      true;
      `;

  const [refreshing, setRefreshing] = useState(false);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    const onBackPress = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true; // Default behavior of BackHandler is prevented
      } else {
        // Optionally show a toast or handle the back press when WebView can't go back
        ToastAndroid.show('No more pages to go back', ToastAndroid.SHORT);
        return false; // Let the default back action occur
      }
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <WebView
          ref={webViewRef}
          source={{uri: 'https://m.youtube.com'}}
          injectedJavaScript={javascriptInjection}
          style={styles.webView}
          allowsFullscreenVideo={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          scrollEnabled={true}
          bounces={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  webViewContainer: {
    flex: 1,
    height: 500, // WebView'in yüksekliğini belirtin veya flex ayarlarını kullanın
  },
  webView: {
    flex: 1,
  },
});

export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useCallback, useRef, useState} from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import WebView from 'react-native-webview';

function App(): React.JSX.Element {
  const javascriptInjection = `
      function removeAllShorts() {
        var allshorts = document.querySelectorAll('[class*="pivot-shorts"]');
        for (let element of allshorts) {
          element.parentElement.remove();
        }
        var element2 = document.querySelector('[class="ShortsLockupViewModelHost"]');
        if (element2) {
          element2.parentElement.parentElement.parentElement.parentElement.remove();
        }
      }
      window.addEventListener('navigate', ()=> {
        removeAllShorts();
      });

      setInterval(() => {
        removeAllShorts();
      }, 1000);
      removeAllShorts();
      true;
      `;

  const [refreshing, setRefreshing] = useState(false);
  const webViewRef = useRef<WebView>(null);

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

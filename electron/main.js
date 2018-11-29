const {
  app,
  BrowserWindow
} = require( 'electron' );
let mainWindow = null;
const url = require( 'url' );
const path = require( 'path' );
const title = require( './package.json' ).title;

function createWindow () {

  mainWindow = global.mainWindow = new BrowserWindow( {
    x: 0,
    y: 0,
    width: 1200,
    height: 800,
    show: false,
    title: title,
    webPreferences: {
      webSecurity: false
    }
  } );

  mainWindow.once( 'ready-to-show', () => {

    console.log( 'loaded...' );
  
  } );

  mainWindow.loadURL( PROD() );

  mainWindow.on( 'close', () => {

    bye();
  
  } );

}

let closing = false;

function bye () {

  if ( closing === true ) return;
  console.log( 'bye bye' );
  closing = true;
  app.quit();

}

function DEV () {

  return 'http://localhost:3000';

}

function PROD () {

  return url.format( path.join( __dirname, 'pkg', 'index.html' ) );

}

app.once( 'ready', createWindow );

app.once( 'window-all-closed', () => {

  bye();

} );

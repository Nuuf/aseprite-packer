import { 
  Load,
  Sprite,
  Utility,
  Packing,
  Vector2D,
  CP
} from '@nuuf/nk2-frontend';

import '../style/default.css';

const COMMANDSTRING = Utility.UUID( 32, 1, 3 );
const fs = window.require( 'fs' );
const url = window.require( 'url' );
const path = window.require( 'path' );
const remote = window.require( 'electron' ).remote;
const appPath = remote.process.cwd();
const rconsole = remote.getGlobal( 'console' );
const options = {
  padding: new Vector2D( 0, 0 ),
  border: new Vector2D( 0, 0 ),
  w: -1,
  h: -1,
  pow2: false,
  imgOut: '',
  imgIn: '',
  dataOut: '',
  dataIn: '',
  debug: false
};
const argv = remote.process.argv.slice();

argv.unshift( COMMANDSTRING );
const toParse = argv.join( ' ' );
const registry = new CP.Registry();
let printOptions = false;
let prettyPrint = false;

createCommands( registry );

registry.Parse( toParse );

if ( printOptions === true ) rconsole.log( JSON.stringify( options, null, 1 ) );

{

  const ssloader = new Load.SpritesheetLoader();

  ssloader.imageLoader.onError.Add( ( event ) => {

    rconsole.log( event.data.path[ 0 ].src, event.data.type );
    throw new Error();
  
  } );

  ssloader.xhrLoader.onLoadError.Add( ( event )=> {

    rconsole.log( event.target.responseURL, event.target.status );
    throw new Error();
  
  } );
  const loaderCombiner = new Load.LoaderCombiner( [ {
    loader: ssloader,
    args: [ [
      {
        id: 'sheet',
        image: { src: options.imgIn },
        data: { src: options.dataIn, type: 'json' }
      }
    ] ]
  } ] );

  loaderCombiner.onComplete.Add( START, null, true );
  loaderCombiner.Load();

  function START () {

    const spritesheet = loaderCombiner.loaders[ 0 ].GetSpritesheetById( 'sheet' );
    const ssDataCopy = Utility.DeepClone( spritesheet.data );

    console.log( spritesheet );

    spritesheet.GenerateFrames();
    const canvas = document.createElement( 'canvas' );

    document.body.appendChild( canvas );

    const ctx = canvas.getContext( '2d' );
    const sprites = [];

    spritesheet.frameCache.items.forEach( ( frame ) => {

      const sprite = new Sprite( 0, 0, spritesheet.basicTexture );

      frame.FullApply( sprite );

      sprite.data.frame = frame;

      sprite.ComputeLocalBounds();

      sprites.push( sprite );

    } );

    sprites.sort( ( a, b ) => {

      return b.bounds.local.area - a.bounds.local.area;
    
    } );

    let result = null;
    let w = 0;
    let h = 0;
    let pow2maxW = 0;
    let pow2maxH = 0;

    if ( options.pow2 === false ) {

      if ( options.w !== -1 && options.h !== -1 ) {

        w = options.w + options.border.x;
        h = options.h + options.border.y;

        const packer = new Packing.RectanglePacker( options.w, options.h ).SetPadding( options.padding.x, options.padding.y );

        result = packer.Pack( sprites, true );

        sprites.forEach( ( sprite, index ) => {

          if ( result[ index ] ) {

            sprite.position.SetV( result[ index ].tl ).AddV( options.border );

            sprite.ComputeLocalBounds();
          
          }

        } );
      
      } else {

        const packer = new Packing.RectanglePacker().SetPadding( options.padding.x, options.padding.y );

        result = packer.PackDynamic( sprites );

        sprites.forEach( ( sprite, index ) => {

          sprite.position.SetV( result[ index ].tl ).AddV( options.border );

          sprite.ComputeLocalBounds();

          w = Math.max( sprite.bounds.local.br.x, w );
          h = Math.max( sprite.bounds.local.br.y, h );

        } );

        w += options.border.x;
        h += options.border.y;
      
      }
    
    } else {

      w = 2;
      h = 2;

      let foundSize = false;
      let vert = false;

      while ( foundSize === false ) {

        foundSize = true;

        const packer = new Packing.RectanglePacker( w, h ).SetPadding( options.padding.x, options.padding.y );

        result = packer.Pack( sprites, true );

        if ( result.length === 0 ) {

          foundSize = false;
        
        } else {

          for ( var i = 0; i < sprites.length; ++i ) {

            if ( !result[ i ] ) {
 
              foundSize = false;
              break;
            
            }
        
          }
        
        }

        if ( foundSize === false ) {

          if ( vert === true ) {

            h *= 2;
            vert = false;
            
          } else {

            w *= 2;
            vert = true;
            
          }
        
        }

      }

      sprites.forEach( ( sprite, index ) => {

        sprite.position.SetV( result[ index ].tl ).AddV( options.border );

        sprite.ComputeLocalBounds();

        pow2maxW = Math.max( sprite.bounds.local.br.x, pow2maxW );
        pow2maxH = Math.max( sprite.bounds.local.br.y, pow2maxH );

      } );

    }

    if ( options.pow2 === true ) {
    
      if ( pow2maxH + options.border.y > h ) {

        h = Utility.NearestPow2Ceil( pow2maxH + options.border.y );
      
      }

      if ( pow2maxW + options.border.x > w ) {

        w = Utility.NearestPow2Ceil( pow2maxW + options.border.x );
      
      }

    }

    canvas.width = w;
    canvas.height = h;

    console.log( canvas.width, canvas.height, 'canvas' );

    sprites.forEach( ( sprite ) => {

      sprite.Render( ctx );
    
    } );

    ssDataCopy.meta.size.w = canvas.width;
    ssDataCopy.meta.size.h = canvas.height;

    sprites.forEach( ( sprite ) => {

      const id = sprite.data.frame.id;
      let frame = null;

      for ( var i = 0; i < ssDataCopy.frames.length; ++i ) {

        if ( ssDataCopy.meta.frameTags ) {

          if ( ssDataCopy.meta.frameTags[ i ] && ssDataCopy.meta.frameTags[ i ].name === id ) {

            frame = ssDataCopy.frames[ i ].frame;
            break;

          }
        
        }

        if ( ssDataCopy.frames[ i ].filename === id ) {

          frame = ssDataCopy.frames[ i ].frame;
          break;
        
        }
      
      }
      
      frame.x = sprite.bounds.local.tl.x;
      frame.y = sprite.bounds.local.tl.y;
    
    } );

    window.buildNew = function ( _quit ) {

      const base64data = canvas.toDataURL( 'png' ).replace( /^data:image\/png;base64,/, '' );
      const ssDataCopyString = JSON.stringify( ssDataCopy, null, prettyPrint === true ? 2 : null );

      fs.writeFileSync( options.imgOut, base64data, 'base64' );
      fs.writeFileSync( options.dataOut, ssDataCopyString, 'utf8' );

      if ( _quit === true ) {

        remote.app.quit();
      
      }
    
    };

    if ( options.debug === false ) {

      window.buildNew( true );
    
    }

  }

}

function createCommands ( registry ) {

  registry.AddCommand(
    new CP.Command( COMMANDSTRING, ( dataStrs, data ) => {

      for ( var key in data ) {
    
        if ( key.substring( 0, 2 ) === '--' ) {

          data[ key.substring( 2 ) ] = data[ key ];
        
        }

      }

      if ( data[ 'paddingX' ] ) {

        options.padding.x = parseInt( data[ 'paddingX' ] );
      
      }

      if ( data[ 'paddingY' ] ) {

        options.padding.y = parseInt( data[ 'paddingY' ] );
      
      }

      if ( data[ 'borderX' ] ) {

        options.border.x = parseInt( data[ 'borderX' ] ) * 2;
      
      }

      if ( data[ 'borderY' ] ) {

        options.border.y = parseInt( data[ 'borderY' ] ) * 2;
      
      }

      if ( data[ 'w' ] ) {

        options.w = parseInt( data[ 'w' ] );
      
      }

      if ( data[ 'h' ] ) {

        options.h = parseInt( data[ 'h' ] );
      
      }

      if ( data[ 'imgOut' ] ) {

        options.imgOut = url.format( path.join( appPath, data[ 'imgOut' ] ) );
      
      }

      if ( data[ 'imgIn' ] ) {

        options.imgIn = url.format( path.join( 'file://', appPath, data[ 'imgIn' ] ) );
      
      }

      if ( data[ 'dataOut' ] ) {

        options.dataOut = url.format( path.join( appPath, data[ 'dataOut' ] ) );
      
      }

      if ( data[ 'dataIn' ] ) {

        options.dataIn = url.format( path.join( 'file://', appPath, data[ 'dataIn' ] ) );
      
      }

    }, 'noinfo', true, true, '--' )
  )
    .AddOption( 'pow2 p2', () => {

      options.pow2 = true;

    }, 'noinfo' )
    .AddOption( 'debug d', () => {

      options.debug = true;

      rconsole.log( 'debugging...' );

      const mainWindow = remote.getGlobal( 'mainWindow' );
      
      mainWindow.show();
      mainWindow.webContents.openDevTools();

    }, 'noinfo' )
    .AddOption( 'printOptions po', () => {

      printOptions = true;
    
    }, 'noinfo' )
    .AddOption( 'prettyPrint pp', () => {

      prettyPrint = true;

    } );

}

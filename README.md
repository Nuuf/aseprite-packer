#### Aseprite Packer

Packs Aseprite spritesheets

#How-to

Install electron globally or locally ( it's not listed as a dependency )

```
> yarn install -g electron |or| > yarn install electron
> yarn install
> yarn run build |or| > yarn run be
> cd ./electron
```

( Can be used as is, [electron . args], check package.json )
( Or you can install electron-builder )

```
> electron-builder
```

( Optionally add to PATH and use as you would... )

# Options
```
--debug, --d

--pow2, --p2

--printOptions, --po

--prettyPrint, --pp
```

#Args
```
--paddingX=# (opt)

--paddingY=# (opt)

--borderX=# (opt)

--borderY=# (opt)

--w=# (req (not with pow2))

--h=# (req (not with pow2))

--imgOut=path (req)

--imgIn=path (req)

--dataOut=path (req)

--dataIn=path (req)
```
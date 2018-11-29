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


#Example batch
```
@echo off
aseprite ^
-b ^
./file.ase ^
./file2.ase ^
./file3.ase ^
--sheet spritesheet.png ^
--data spritesheet.json ^
--format json-array ^
--list-tags ^
--sheet-pack
aseprite-packer ^
--p2 ^
--pp ^
--po ^
--imgIn=spritesheet.png ^
--imgOut=spritesheet-packed.png ^
--dataIn=spritesheet.json ^
--dataOut=spritesheet-packed.json ^
--paddingX=1 ^
--paddingY=1 ^
--borderX=1 ^
--borderY=1
```
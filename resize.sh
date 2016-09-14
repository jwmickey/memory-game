#!/bin/sh

indir=$1
outdir=$2

files=`find $indir -name "*.png"`

for file in $files; do 
  name=${file##*/}
  out=$outdir$name
  echo "Resizing $file..."
  convert $file -resample 160 -resize 160x160 $out
  convert $out -background None -extent 160x160 $out
done

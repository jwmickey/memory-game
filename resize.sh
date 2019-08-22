#!/bin/sh

# ATTENTION: This script assumes imagemagick is installed

indir=$1
outdir=$2

files=`find $indir -name "*.png"`

for file in $files; do 
  name=${file##*/}
  out=$outdir$name
  echo "Resizing $file..."
  convert $file -resample 240 -resize 240x $out
  convert $out -background None -extent 240x $out
done

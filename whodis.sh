#!/usr/bin/env sh

SOURCE="$1"
DEST="$2"

if [ -z "$SOURCE" ] || [ -z "$DEST" ]; then
    echo "whodis.sh: error: too few arguments"
    echo "Usage: whodis.sh SOURCE DEST"
    exit
fi

for i in $(cat "$SOURCE"); do
    node whodis.js "$i" -j "$DEST"
done

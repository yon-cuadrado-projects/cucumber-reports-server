scriptFolder="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

scriptParentFolder="$(dirname "$(dirname "$scriptFolder")")"

nodeModulesFolder="$scriptParentFolder"/node_modules
echo "node modules folder: $nodeModulesFolder"

if [ ! -d "$nodeModulesFolder" ]; then
    cd "$scriptParentFolder";npm install;cd "$projectFolder"
fi

if ! [ -z "$1" ];then
    echo "file $1 provided as configuration"
fi

cd $scriptParentFolder;npx ts-node -r tsconfig-paths/register -T ./src/scripts/ts/startServer.ts "$1"
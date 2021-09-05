depTools=""

if type yarn > /dev/null; then
  depTools="yarn"
elif type cnpm > /dev/null
then
  depTools="cnpm install"
elif type npm > /dev/null
then
  depTools="npm install"
else
  return
fi
cd $1
eval $depTools

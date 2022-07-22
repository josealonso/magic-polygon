# shopt -s globstar  # enable recursivity
for i in *.ts; do
  [[ -d "$i" ]] && continue;  # skip directories
  mv -v "$i" "${i%.ts}.tsx";
done

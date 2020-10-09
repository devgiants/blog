#/bin/bash
mv docs/CNAME /tmp
make up
docker-compose exec -u www-data php bash -c "php vendor/bin/sculpin generate -e prod --clean"
rm -rf docs
mv output_prod docs
echo "devgiants.fr" >> docs/CNAME

git add .
git commit -m "Add post"
git push origin master

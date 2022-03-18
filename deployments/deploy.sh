docker build -f dockerfile -t ${DOCKER_IMAGE_TAG}:latest ..

docker ps -f name=${DOCKER_CONTAINER_NAME} -q | xargs --no-run-if-empty docker container stop
docker container ls -a -fname=${DOCKER_CONTAINER_NAME} -q | xargs -r docker container rm
docker images --no-trunc --all --quiet --filter='dangling=true' | xargs --no-run-if-empty docker rmi
docker run --network ${DOCKER_NETWORK_NAME} --expose 3000 -d --name ${DOCKER_CONTAINER_NAME} ${DOCKER_IMAGE_TAG}:latest
FROM ubuntu:latest

RUN apt-get update -y

RUN apt-get upgrade -y

WORKDIR /usr/src/app

ADD https://github.com/CrowCpp/Crow/releases/download/v1.0%2B5/crow-v1.0+5.deb .

RUN apt-get install -y libboost-all-dev
RUN apt-get install -y libhiredis-dev


RUN apt-get install -y meson
RUN apt-get install -y ninja-build

RUN apt-get install -y g++

RUN dpkg -i crow-v1.0+5.deb

RUN apt-get install -f

COPY . .

RUN meson setup build
RUN ninja -C build

EXPOSE 8080

CMD ["./build/hackatum-backend"]

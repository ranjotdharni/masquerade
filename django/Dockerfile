FROM python:3.13-slim as builder

WORKDIR /usr/src/django

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc

RUN pip install --upgrade pip
COPY . /usr/src/django/

COPY ./requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/django/wheels -r requirements.txt

FROM python:3.13-slim

RUN mkdir -p /home/django
RUN addgroup --system django && adduser --system --group django

ENV HOME=/home/django
ENV APP_HOME=/home/django/api
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

RUN apt-get update && apt-get install -y --no-install-recommends netcat
COPY --from=builder /usr/src/django/wheels /wheels
COPY --from=builder /usr/src/django/requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache /wheels/*

COPY . $APP_HOME

RUN chown -R django:django $APP_HOME

USER django

project('hackatum-backend', 'cpp',
  version : '0.1',
  default_options : [
    'warning_level=3',
    'cpp_std=c++2a',
    'optimization=3']
)

src_files = [ 'main.cpp' ]
subdir('src')

cmake = import('cmake')

redis = cmake.subproject('redis-plus-plus')

redis_dep = redis.dependency('redis++')

dependencies = [
  redis_dep
]



target = executable(
  meson.project_name(),
  src_files,
  dependencies: dependencies,
)

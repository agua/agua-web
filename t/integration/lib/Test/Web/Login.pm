use Moose::Util::TypeConstraints;
use MooseX::Declare;
use Method::Signatures::Modifiers;

class Test::Common::Login with (Web::Login, Test::Table, Util::Main::Logger, Table::Main, Web::Group::Privileges, Agua::Common::Exchange) {

use Data::Dumper;
use Test::More;
use FindBin qw($Bin);

# Ints
has 'LOG'		=> ( isa => 'Int', 		is => 'rw', default	=> 	2);

# STRINGS
has 'dumpfile'		=>  ( isa => 'Str|Undef', is => 'rw' );
has 'username'		=>  ( isa => 'Str|Undef', is => 'rw' );
has 'password'		=>  ( isa => 'Str|Undef', is => 'rw' );
has 'database'		=>  ( isa => 'Str|Undef', is => 'rw' );
has 'logfile'		=>  ( isa => 'Str|Undef', is => 'rw' );
has 'requestor'		=> 	( isa => 'Str|Undef', is => 'rw' );

# OBJECTS
has 'db'		=> ( isa => 'DBase::MySQL', is => 'rw', required => 0 );
has 'conf' 	=> (
	is 		=>	'rw',
	isa 	=> 	'Conf::Yaml|Undef'
);

#####/////}}}}}

method BUILD ($args) {
	if ( defined $args ) {
		foreach my $arg ( $args ) {
			$self->$arg($args->{$arg}) if $self->can($arg);
		}
	}
}

method testSubmitLogin {
	diag("# submitLogin");
	
	#### SET AUTHENTICATION TO password
	$self->conf()->getKey("authentication:TYPE", "password");
	
	##### LOAD DATABASE
	$self->setUpTestDatabase();
	$self->setDatabaseHandle();

	my $tests = [
		{
			testname	=>	"login success",
			tsvfile		=>	"$Bin/inputs/users-success.tsv",
			username	=>	"testuser",
			password	=>	12345678,
			expected	=>	{
				'status' => 'ready',
				'data' => {
							'sessionid' => ''
						  },
				'username' => 'testuser',
				'sourceid' => '',
				'callback' => '',
				'error' => '',
				'queue' => 'routing',
				'token' => undef
			}
		}
		,
		{
			testname	=>	"login failure",
			tsvfile		=>	"$Bin/inputs/users-success.tsv",
			username	=>	"testuser",
			password	=>	"WRONGPASSWORD",
			expected	=>	{
				'status' => 'error',
				'data' => {
					'sessionid' => undef
				},
				'username' => 'testuser',
				'sourceid' => '',
				'callback' => '',
				'error' => "Password does not match for user: testuser",
				'queue' => 'routing',
				'token' => undef
			}
		}
	];

	#### START LISTENING
	my $queuename	=	"test.worker.queue";
	my $childpid = fork;
	if ( $childpid ) #### ****** Parent ****** 
	{
		$self->logDebug("PARENT childpid", $childpid);
	}
	elsif ( defined $childpid ) {
		$self->receiveSocket();
	}
	
	foreach my $test ( @$tests ) {
		my $testname	=	$test->{testname};
		my $tsvfile		=	$test->{tsvfile};
		my $expected	=	$test->{expected};
		
		#### LOAD TSVFILE
		$self->loadTsvFile("users", $tsvfile);
		
		#### SET USERNAME AND PASSWORD
		$self->username($test->{username});
		$self->password($test->{password});
		
		my $username	=	$self->username();
		my $password 	=	$self->password();
		$self->logDebug("username", $username);
		$self->logDebug("password", $password);

		#### OVERRIDE Agua::Common::Exchange::send
		no warnings;
		*notifyStatus = sub {
			my $self	=	shift;
			my $data	=	shift;
			#$self->logDebug("data", $data);		
			$data->{data}->{sessionid} = "" if defined $data->{data}->{sessionid};
			is_deeply($data, $expected, "notifyStatus 'data' argument correct");
		};
		use warnings;

		$self->submitLogin();
	}
}


}	####	Agua::Login::Common
